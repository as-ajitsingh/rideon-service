import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { utils, write } from 'xlsx';

import { CreateRequestDto } from './dto/create-request.dto';
import { UserDocument } from '../user/user.schema';
import { VendorService } from '../vendor/vendor.service';
import PaginationDTO from '../common/pagination.dto';
import { ExportRequestsFilterDto } from './dto/export-requests-filter.dto';
import { Request, RequestDocument, RequestStatus } from './request.schema';
import { getRequestInfo, getformattedApprovalMessage } from './request.util';
import { SMSService } from '../sms/sms.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name) private request: Model<RequestDocument>,
    private vendorService: VendorService,
    private smsService: SMSService,
    private configService: ConfigService,
  ) {}

  private getLimitAndSkipFrom(paginationOptions: PaginationDTO) {
    const limit = paginationOptions.limit || 10;
    const pageNumber = paginationOptions.pageNumber || 1;
    return { limit, pageNumber, skip: (pageNumber - 1) * limit };
  }

  createRequest(createRequestDto: CreateRequestDto, user: UserDocument) {
    return new this.request({ ...createRequestDto, status: RequestStatus.PENDING, raisedBy: user._id }).save();
  }

  async getAllRequestForEmployee(user: UserDocument, paginationOptions?: PaginationDTO) {
    const { limit, skip, pageNumber } = this.getLimitAndSkipFrom(paginationOptions);

    const count = await this.request.count({ raisedBy: user._id }).exec();
    const requests = await this.request
      .find({ raisedBy: user._id })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'raisedBy' })
      .populate({ path: 'allotedVendor' })
      .exec();

    return { data: requests, metadata: { pageNumber, limit, total: count } };
  }

  async getAllRequestForAdmin(paginationOptions?: PaginationDTO) {
    const { limit, skip, pageNumber } = this.getLimitAndSkipFrom(paginationOptions);

    const count = await this.request.count().exec();
    const requests = await this.request
      .find()
      .skip(skip)
      .limit(limit)
      .populate({ path: 'raisedBy' })
      .populate({ path: 'allotedVendor' })
      .exec();

    return { data: requests, metadata: { pageNumber, limit, total: count } };
  }

  async exportRequests(exportRequestFilter: ExportRequestsFilterDto) {
    const requests = await this.request
      .find({
        createdAt: {
          $gte: exportRequestFilter.startDate,
          $lte: exportRequestFilter.endDate,
        },
      })
      .populate({ path: 'raisedBy' })
      .populate({ path: 'allotedVendor' })
      .exec();

    const groupedRequests = requests.reduce((groupedRequests: { [k: string]: Request[] }, request) => {
      if (groupedRequests[request.status]) groupedRequests[request.status].push(request);
      else groupedRequests[request.status] = [request];
      return groupedRequests;
    }, {});

    const workbook = utils.book_new();

    Object.entries(groupedRequests).forEach(([status, requests]) => {
      utils.book_append_sheet(workbook, utils.json_to_sheet(requests.map(getRequestInfo)), status);
    });

    return write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  getRequest(requestId: string) {
    return this.request.findById(requestId).populate({ path: 'raisedBy' }).exec();
  }

  async updateStatus(requestId: string, vendorId: string, status: RequestStatus, rejectionReason: string) {
    const request = await this.getRequest(requestId);

    if (!request) throw new Error('request id not valid');

    if (status === RequestStatus.APPROVED) {
      if (!vendorId) throw new Error('vendor required for approval');

      const vendor = await this.vendorService.getVendor(vendorId);

      if (!vendor) throw new Error('vendor id not valid');

      const result = await this.request
        .updateOne({ _id: requestId }, { $set: { allotedVendor: vendorId, status }, $unset: { reason: 1 } })
        .exec();

      if (result.acknowledged && result.modifiedCount != 0) {
        await this.smsService.sendMessage(
          vendor.contactNumber,
          getformattedApprovalMessage(request, this.configService.get('ASSIGNMENT_MESSAGE')),
        );
      }
    } else if (status === RequestStatus.REJECTED) {
      if (!rejectionReason) throw new Error('reason required for rejection');

      const result = await this.request
        .updateOne({ _id: requestId }, { $set: { status, reason: rejectionReason }, $unset: { allotedVendor: 1 } })
        .exec();
      console.log(RequestStatus.REJECTED, result);
    }
  }
}

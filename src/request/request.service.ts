import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument, RequestStatus } from './request.schema';
import { Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { UserDocument } from '../user/user.schema';
import { VendorService } from '../vendor/vendor.service';
import PaginationDTO from '../common/pagination.dto';
import { ExportRequestsFilterDto } from './dto/export-requests-filter.dto';
import { utils, write } from 'xlsx';
import { getRequestInfo } from './request.util';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name) private request: Model<RequestDocument>,
    private vendorService: VendorService,
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
      .exec();

    return { data: requests, metadata: { pageNumber, limit, total: count } };
  }

  async getAllRequestForAdmin(paginationOptions?: PaginationDTO) {
    const { limit, skip, pageNumber } = this.getLimitAndSkipFrom(paginationOptions);

    const count = await this.request.count().exec();
    const requests = await this.request.find().skip(skip).limit(limit).populate({ path: 'raisedBy' }).exec();

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
      .exec();

    const worksheet = utils.json_to_sheet(requests.map(getRequestInfo));
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Requests');

    return write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  getRequest(requestId: string) {
    return this.request.findById(requestId).exec();
  }

  async updateStatus(requestId: string, vendorId: string, status: RequestStatus, rejectionReason: string) {
    if (!(await this.getRequest(requestId))) throw new Error('request id not valid');

    let query = {};

    if (status === RequestStatus.APPROVED) {
      if (!vendorId) throw new Error('vendor required for approval');
      if (!(await this.vendorService.getVendor(vendorId))) throw new Error('vendor id not valid');

      query = { $set: { allotedVendor: vendorId, status }, $unset: { reason: 1 } };
    } else if (status === RequestStatus.REJECTED) {
      if (!rejectionReason) throw new Error('reason required for rejection');

      query = { $set: { status, reason: rejectionReason }, $unset: { allotedVendor: 1 } };
    }

    await this.request.updateOne({ _id: requestId }, query).exec();
  }
}

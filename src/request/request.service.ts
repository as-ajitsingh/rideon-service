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
import {
  getFormattedSubject,
  getRequestInfo,
  getformattedApprovalMessage,
  getformattedNewRequestEmailHtml,
} from './request.util';
import { SMSService } from '../sms/sms.service';
import { ConfigService } from '@nestjs/config';
import { getLimitAndSkipFrom } from '../common/utils';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { emailTemplate } from './email.template.hbs';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name) private request: Model<RequestDocument>,
    private vendorService: VendorService,
    private smsService: SMSService,
    private emailService: EmailService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async createRequest(createRequestDto: CreateRequestDto, user: UserDocument) {
    const request = await new this.request({
      ...createRequestDto,
      status: RequestStatus.PENDING,
      raisedBy: user._id,
    }).save();

    const requestWithUser = await request.populate({ path: 'raisedBy' });

    await this.sendConfirmationMail(requestWithUser);

    return request;
  }

  private async sendConfirmationMail(requestWithRaisedBy: RequestDocument) {
    const admins = await this.userService.getAllAdmins();
    const adminEmails = admins.map((user) => user.email);
    const subject = getFormattedSubject(requestWithRaisedBy, this.configService.get('NEW_REQUEST_MAIL_SUBJECT'));
    const webAppRequestPath = this.configService.get('WEB_APP_REQUEST_PATH');
    const webAppUrl = this.configService.get('WEB_APP_URL');
    await this.emailService.sendMail(
      adminEmails,
      subject,
      getformattedNewRequestEmailHtml(requestWithRaisedBy, emailTemplate, webAppUrl, webAppRequestPath),
    );
  }

  async getAllRequestForEmployee(user: UserDocument, paginationOptions?: PaginationDTO) {
    const { limit, skip, pageNumber } = getLimitAndSkipFrom(paginationOptions);

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
    const { limit, skip, pageNumber } = getLimitAndSkipFrom(paginationOptions);

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
      if (!vendorId) throw new Error('vendor required for approval'); //todo: move it to controller level
      await this.approveRequestt(vendorId, request);
    } else if (status === RequestStatus.REJECTED) {
      if (!rejectionReason) throw new Error('reason required for rejection'); //todo: move it to controller level

      await this.rejectRequest(requestId, rejectionReason);
    }
  }

  private async rejectRequest(requestId: string, rejectionReason: string) {
    const result = await this.request
      .updateOne(
        { _id: requestId },
        { $set: { status: RequestStatus.REJECTED, reason: rejectionReason }, $unset: { allotedVendor: 1 } },
      )
      .exec();
    console.log(RequestStatus.REJECTED, result);
  }

  private async approveRequestt(vendorId: string, request: RequestDocument) {
    const vendor = await this.vendorService.getVendor(vendorId);

    if (!vendor) throw new Error('vendor id not valid');

    const result = await this.request
      .updateOne(
        { _id: request._id },
        { $set: { allotedVendor: vendorId, status: RequestStatus.APPROVED }, $unset: { reason: 1 } },
      )
      .exec();

    if (result.acknowledged && result.modifiedCount != 0) {
      await this.smsService.sendMessage(
        vendor.contactNumber,
        getformattedApprovalMessage(request, this.configService.get('ASSIGNMENT_MESSAGE')),
      );
    }
  }
}

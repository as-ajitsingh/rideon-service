import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument, RequestStatus } from './request.schema';
import { Model } from 'mongoose';
import { CreateRequestDto } from './dto/request.dto';
import { UserDocument } from '../user/user.schema';
import { VendorService } from '../vendor/vendor.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name) private request: Model<RequestDocument>,
    private vendorService: VendorService,
  ) {}

  createRequest(createRequestDto: CreateRequestDto, user: UserDocument) {
    return new this.request({ ...createRequestDto, status: RequestStatus.PENDING, raisedBy: user._id }).save();
  }

  getAllRequestForEmployee(user: UserDocument) {
    return this.request.find({ raisedBy: user._id }).populate({ path: 'raisedBy', select: 'authId' }).exec();
  }

  getAllRequestForAdmin() {
    return this.request.find().exec();
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

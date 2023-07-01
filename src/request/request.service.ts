import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument, RequestStatus } from './request.schema';
import { Model } from 'mongoose';
import { CreateRequestDto } from './dto/request.dto';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class RequestService {
  constructor(@InjectModel(Request.name) private request: Model<RequestDocument>) {}

  createRequest(createRequestDto: CreateRequestDto, user: UserDocument) {
    return new this.request({ ...createRequestDto, status: RequestStatus.PENDING, raisedBy: user._id }).save();
  }

  getAllRequestForEmployee(user: UserDocument) {
    return this.request.find({ raisedBy: user._id }).populate({ path: 'raisedBy', select: 'authId' }).exec();
  }

  getAllRequestForAdmin() {
    return this.request.find().exec();
  }

  async updateStatus(requestId: string, vendorId: string, status: RequestStatus) {
    if (status === RequestStatus.APPROVED) {
      if (!vendorId) throw new Error('vendor required for approval');
      await this.request.updateOne({ _id: requestId }, { $set: { allotedVendor: vendorId, status } }).exec();
      return;
    }
  }
}

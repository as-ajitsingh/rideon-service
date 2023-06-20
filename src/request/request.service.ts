import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument } from './request.schema';
import { Model } from 'mongoose';
import { CreateRequestDto } from './request.dto';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class RequestService {
  constructor(@InjectModel(Request.name) private request: Model<RequestDocument>) {}

  createRequest(createRequestDto: CreateRequestDto, user: UserDocument) {
    return new this.request({ ...createRequestDto, raisedBy: user._id }).save();
  }

  getAllRequestForEmployee(user: UserDocument) {
    return this.request.find({ raisedBy: user._id }).populate({ path: 'raisedBy', select: 'authId' }).exec();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<UserDocument>) {}

  async getOrRegisterUser(authId: string): Promise<User> {
    const user = await this.getUser(authId);
    return (
      user ?? new this.user({ roles: ['employee'], authId: authId }).save()
    );
  }

  async getUser(authId): Promise<User> {
    return this.user.findOne({ authId: authId }).exec();
  }
}

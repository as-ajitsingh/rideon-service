import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<UserDocument>, private configService: ConfigService) {}

  async getOrRegisterUser(authId: string, userAccessToken: string): Promise<User> {
    const user = await this.getUser(authId);

    return (
      user ??
      new this.user({ roles: ['employee'], authId: authId, ...(await this.getUserInfo(userAccessToken)) }).save()
    );
  }

  async getUser(authId): Promise<User> {
    return this.user.findOne({ authId: authId }).exec();
  }

  async getUserInfo(token) {
    const response = await fetch(`${this.configService.get('AUTH0_ISSUER_URL')}userinfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('get user info from auth0 failed');
    }
  }
}

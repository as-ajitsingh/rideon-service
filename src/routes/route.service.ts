import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/CreateRouteDto';
import { Route } from './route.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RouteService {
  constructor(@InjectModel(Route.name) private route: Model<Route>) {}

  createRoute(createRouteDto: CreateRouteDto) {
    return new this.route(createRouteDto).save();
  }
}

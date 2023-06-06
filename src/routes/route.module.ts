import { Module } from '@nestjs/common';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from './route.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
  ],
  controllers: [RouteController],
  providers: [RouteService],
})
export class RoutesModule {}

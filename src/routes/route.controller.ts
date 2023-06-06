import {
  Body,
  Controller,
  Get,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/CreateRouteDto';
import { RolesGuard } from '../authorisation/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@SetMetadata('roles', ['admin'])
@Controller('routes')
export class RouteController {
  constructor(private routesService: RouteService) {}

  @Get()
  getAllRoutes() {
    return ['new routes'];
  }

  @Post()
  createRoute(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.createRoute(createRouteDto);
  }
}

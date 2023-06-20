import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateRequestDto } from './request.dto';
import { RequestingUser } from 'src/user/user.decorator';
import { UserDocument } from 'src/user/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/authorisation/roles.guard';
import { RequestService } from './request.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('requests')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get()
  getAllRequests(@RequestingUser() user: UserDocument) {
    return this.requestService.getAllRequestForEmployee(user);
  }

  @Post()
  createRequest(@Body() request: CreateRequestDto, @RequestingUser() user: UserDocument) {
    return this.requestService.createRequest(request, user);
  }
}

import { Body, Controller, Get, HttpCode, Param, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestingUser } from '../user/user.decorator';
import { UserDocument } from '../user/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../authorisation/roles.guard';
import { RequestService } from './request.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('requests')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get()
  getAllRequests(@RequestingUser() user: UserDocument) {
    return user.roles.includes('admin')
      ? this.requestService.getAllRequestForAdmin()
      : this.requestService.getAllRequestForEmployee(user);
  }

  @Post()
  createRequest(@Body() request: CreateRequestDto, @RequestingUser() user: UserDocument) {
    return this.requestService.createRequest(request, user);
  }

  @Post('/:requestId/updateStatus')
  @HttpCode(204)
  @SetMetadata('roles', ['admin'])
  updateStatus(@Param() params: any, @Body() updateStatusDto: UpdateStatusDto) {
    return this.requestService.updateStatus(
      params.requestId,
      updateStatusDto.vendorId,
      updateStatusDto.status,
      updateStatusDto.rejectionReason,
    );
  }
}

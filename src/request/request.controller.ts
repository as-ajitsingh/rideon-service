import { Body, Controller, Get, HttpCode, Param, Post, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestingUser } from '../user/user.decorator';
import { UserDocument } from '../user/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../authorisation/roles.guard';
import { RequestService } from './request.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import Pagination from '../common/pagination.decorator';
import PaginationDTO from '../common/pagination.dto';
import ExportRequestsFilter from './decorators/export-requests-filter.decorator';
import { ExportRequestsFilterDto } from './dto/export-requests-filter.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('requests')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get()
  getAllRequests(@RequestingUser() user: UserDocument, @Pagination() paginationOptions: PaginationDTO) {
    return user.roles.includes('admin')
      ? this.requestService.getAllRequestForAdmin(paginationOptions)
      : this.requestService.getAllRequestForEmployee(user, paginationOptions);
  }

  @Get('/export')
  @SetMetadata('roles', ['admin'])
  async exportAllRequests(@ExportRequestsFilter() exportRequestFilter: ExportRequestsFilterDto, @Res() res: Response) {
    const { startDate, endDate } = exportRequestFilter;
    if (!endDate || !startDate) throw new Error('all filters are required');

    res.setHeader('Content-Type', 'multipart/form-data');
    res.setHeader('Content-Disposition', `attachment; filename="cab-requests-${Date.now()}.xlsx"`);
    res.send(await this.requestService.exportRequests({ startDate: new Date(startDate), endDate: new Date(endDate) }));
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

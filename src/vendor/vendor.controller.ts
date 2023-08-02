import { Controller, Get, HttpCode, Post, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../authorisation/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import Pagination from '../common/pagination.decorator';
import PaginationDTO from '../common/pagination.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@SetMetadata('roles', ['admin'])
@Controller('vendors')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Get()
  @SetMetadata('roles', ['admin'])
  getAllVendors(@Pagination() paginationOptions: PaginationDTO) {
    return this.vendorService.getAllVendors(paginationOptions);
  }

  @HttpCode(204)
  @Post('/bulk')
  @UseInterceptors(FileInterceptor('file'))
  @SetMetadata('roles', ['admin'])
  bulkUploadVendor(@UploadedFile() file: Express.Multer.File) {
    return this.vendorService.bulkUploadVendors(file);
  }
}

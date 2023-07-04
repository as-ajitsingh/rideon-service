import { Controller, Get, HttpCode, Post, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../authorisation/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@SetMetadata('roles', ['admin'])
@Controller('vendors')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Get()
  getAllVendors() {
    return this.vendorService.getAllVendors();
  }

  @HttpCode(204)
  @Post('/bulk')
  @UseInterceptors(FileInterceptor('file'))
  bulkUploadVendor(@UploadedFile() file: Express.Multer.File) {
    return this.vendorService.bulkUploadVendors(file);
  }
}

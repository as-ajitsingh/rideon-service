import { Controller, Get, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../authorisation/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@SetMetadata('roles', ['admin'])
@Controller('vendors')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Get()
  getAllVendors() {
    return this.vendorService.getAllVendors();
  }

  @Post()
  bulkUploadVendor() {
    return 'not implemented';
  }
}

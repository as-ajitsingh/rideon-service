import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor, VendorDocument } from './vendor.schema';

@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private vendor: Model<VendorDocument>) {}

  getAllVendors() {
    return this.vendor.find().exec();
  }

  getVendor(vendorId: string) {
    return this.vendor.findById(vendorId).exec();
  }
}

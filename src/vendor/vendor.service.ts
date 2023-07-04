import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor, VendorDocument } from './vendor.schema';
import { read, utils } from 'xlsx';

@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private vendor: Model<VendorDocument>) {}

  getAllVendors() {
    return this.vendor.find().exec();
  }

  getVendor(vendorId: string) {
    return this.vendor.findById(vendorId).exec();
  }

  async bulkUploadVendors(file: Express.Multer.File) {
    const workbook = read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet, { header: 1 });
    const vendors = data
      .slice(1)
      .reduce((vendors: { name: string; contactNumber: string }[], currentVendor: string[]) => {
        const [name, contactNumber] = currentVendor;
        vendors.push({ name, contactNumber });
        return vendors;
      }, []);
    await this.vendor.insertMany(vendors);
  }
}

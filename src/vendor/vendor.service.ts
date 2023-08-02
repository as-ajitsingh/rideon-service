import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor, VendorDocument } from './vendor.schema';
import { read, utils } from 'xlsx';
import PaginationDTO from '../common/pagination.dto';
import { getLimitAndSkipFrom } from '../common/utils';

@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private vendor: Model<VendorDocument>) {}

  async getAllVendors(paginationOptions?: PaginationDTO) {
    const { limit, skip, pageNumber } = getLimitAndSkipFrom(paginationOptions);

    const count = await this.vendor.count().exec();
    const vendors = await this.vendor.find().skip(skip).limit(limit).exec();

    return { data: vendors, metadata: { pageNumber, limit, total: count } };
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

import { RequestStatus } from '../request.schema';

export class UpdateStatusDto {
  vendorId: string;
  status: RequestStatus;
  rejectionReason: string;
}

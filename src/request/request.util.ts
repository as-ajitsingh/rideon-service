import { RequestDocument } from './request.schema';

const getFormattedDate = (date: Date) =>
  date.toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
  });

export const getRequestInfo = (request: RequestDocument) => ({
  'Employee Email': request.raisedBy.email,
  'Employee Name': request.raisedBy.name,
  'Project Code': request.projectCode,
  'PickUp Location': request.pickupLocation,
  'Drop Location': request.dropLocation,
  'Pickup Time': request.pickupTime,
  Status: request.status,
  Vendor: request.allotedVendor ?? undefined,
  'Created At': getFormattedDate(request.createdAt),
  'Updated At': getFormattedDate(request.updatedAt),
});

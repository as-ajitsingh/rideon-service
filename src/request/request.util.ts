import { sprintf } from 'sprintf-js';
import { RequestDocument } from './request.schema';
import { getReadableDateTime } from '../common/utils';

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
  Vendor: request.allotedVendor?.name,
  'Created At': getFormattedDate(request.createdAt),
  'Updated At': getFormattedDate(request.updatedAt),
});

export const getformattedApprovalMessage = (request: RequestDocument, messageTemplate: string) =>
  sprintf(
    messageTemplate,
    request.raisedBy.name,
    getReadableDateTime(request.pickupTime),
    request.pickupLocation,
    request.dropLocation,
    request.raisedBy.name,
    request.raisedBy.email,
    '+91-9000XXXXXX',
  );

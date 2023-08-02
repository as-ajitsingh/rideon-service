import PaginationDTO from './pagination.dto';

export const getReadableDateTime = (date: Date) =>
  date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Kolkata',
    hour12: true,
  });

export const getLimitAndSkipFrom = (paginationOptions: PaginationDTO) => {
  const limit = paginationOptions.limit || 10;
  const pageNumber = paginationOptions.pageNumber || 1;
  return { limit, pageNumber, skip: (pageNumber - 1) * limit };
};

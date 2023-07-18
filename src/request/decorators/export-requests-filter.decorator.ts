import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const ExportRequestsFilter = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const query = request.query;

  return { startDate: query['start-date'], endDate: query['end-date'] };
});

export default ExportRequestsFilter;

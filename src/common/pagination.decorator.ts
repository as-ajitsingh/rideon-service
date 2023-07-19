import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const Pagination = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return { pageNumber: request.query['page-number'], limit: request.query['limit'] };
});

export default Pagination;

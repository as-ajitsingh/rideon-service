import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const Pagination = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.query;
});

export default Pagination;

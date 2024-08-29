import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
const ApiResponseType = <TModel extends Type<any>>(
  model: TModel,
  status = HttpStatus.OK,
  isArray?: boolean,
) => {
  return applyDecorators(
    ApiResponse({
      isArray,
      type: model,
      status,
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }],
      },
    }),
  );
};

export { ApiResponseType };

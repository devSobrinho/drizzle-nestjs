import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponseTypePagination = <TModel extends Type<any>>(
  model: TModel,
  status = HttpStatus.OK,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              totalItems: {
                type: 'number',
              },
              totalPages: {
                type: 'number',
              },
              page: {
                type: 'number',
              },
              size: {
                type: 'number',
              },
            },
          },
        ],
      },
    }),
  );
};

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsStrongPassword', async: true })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  resultError = [];
  validate(value: any): boolean {
    this.resultError = this.validatePassword(value);
    return this.resultError.length === 0;
  }
  defaultMessage(): string {
    return this.resultError.join(', ');
  }

  validatePassword(password: string) {
    const arrRegex = [
      {
        regex: /.{8,}/,
        message: 'A senha deve ter pelo menos 8 caracteres',
      },
      {
        regex: /(?=.*[!@#$%^&*()_+\-=\{\}\[\]|\\:;\"'<>,.?\/])/,
        message: 'A senha deve ter pelo menos 1 caractere especial',
      },
      {
        regex: /(?=.*[A-Z])/,
        message: 'A senha deve ter pelo menos 1 letra maiúscula',
      },
      {
        regex: /(?=.*[a-z])/,
        message: 'A senha deve ter pelo menos 1 letra minúscula',
      },
      {
        regex: /(?=.*[0-9])/,
        message: 'A senha deve ter pelo menos 1 número',
      },
    ];

    const result = arrRegex
      .filter((item) => !item.regex.test(password))
      ?.map((item) => item.message);
    return result;
  }
}

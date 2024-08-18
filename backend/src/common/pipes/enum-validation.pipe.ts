import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isDefined, isEnum } from 'class-validator';

@Injectable()
export class EnumValidationPipe implements PipeTransform<string, Promise<any>> {
  constructor(private enumEntity: any) {}
  transform(value: string): any {
    if (isDefined(value) && isEnum(value, this.enumEntity)) {
      return value;
    } else {
      const errorMessage = `Invalid value: ${value}. Allowed values are: ${Object.keys(
        this.enumEntity,
      )
        .map((key) => this.enumEntity[key])
        .join(', ')}`;
      throw new BadRequestException(errorMessage);
    }
  }
}

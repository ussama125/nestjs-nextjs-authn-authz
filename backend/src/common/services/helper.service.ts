import { Injectable, Logger } from '@nestjs/common';
import mongoose, { FilterQuery } from 'mongoose';
import * as otpGenerator from 'otp-generator';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class HelperService {
  private readonly logger = new Logger(HelperService.name);

  constructor() {}

  buildFilterQuery(
    schema: any,
    filters: Record<string, string | string[]>,
  ): FilterQuery<any> {
    this.logger.log('Filters: ', filters);
    const filterQuery: FilterQuery<any> = {};

    for (const field in filters) {
      if (filters.hasOwnProperty(field)) {
        // const fieldType = this.getFieldType(schema, field);

        if (Array.isArray(filters[field])) {
          this.logger.log('array');
          // Create a regular expression pattern by joining array values with |
          const pattern = (filters[field] as string[]).join('|');
          filterQuery[field] = { $regex: new RegExp(pattern, 'i') };
        } else if (filters[field] === 'true' || filters[field] === 'false') {
          filterQuery[field] = filters[field];
        } else if (this.isValidObjectId(filters[field])) {
          filterQuery[field] = filters[field];
        } else {
          // Handle partial text matching using regular expressions for string fields
          filterQuery[field] = {
            $regex: new RegExp(filters[field] as string, 'i'),
          };
        }
      }
    }

    return filterQuery;
  }

  getVerificationToken({ length = 8 }) {
    return randomStringGenerator() + otpGenerator.generate(length);
  }

  private isValidObjectId(id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      if (String(new mongoose.Types.ObjectId(id)) === id) return true;
      return false;
    }
    return false;
  }
}

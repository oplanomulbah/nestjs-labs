import { Module } from '@nestjs/common';
import { ApartmentController } from './apartment.controller.js';
import { ApartmentService } from './apartment.service.js';

@Module({
  controllers: [ApartmentController],
  providers: [ApartmentService]
})
export class ApartmentModule {}

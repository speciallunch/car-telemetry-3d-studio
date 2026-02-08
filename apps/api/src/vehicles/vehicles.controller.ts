import { Controller, Get, Param, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller()
export class VehiclesController {
  constructor(private readonly vehicles: VehiclesService) {}

  @Get('/vehicles')
  async getVehicles() {
    return this.vehicles.listVehicles();
  }

  @Get('/vehicles/:id/telemetry')
  async getTelemetry(@Param('id') id: string, @Query('limit') limit?: string) {
    const take = limit ? Math.max(1, Math.min(200, Number(limit))) : 20;
    return this.vehicles.latestTelemetry(id, take);
  }
}

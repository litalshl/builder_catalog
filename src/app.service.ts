import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServiceAlive(): string {
    return 'Service Alive';
  }
}

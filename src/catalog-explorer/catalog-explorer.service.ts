import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { Set, Brick } from './catalog-explorer.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CatalogExplorerService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private readonly httpService: HttpService) {}

  async getUserByUsername(username: string) {
    const response = await lastValueFrom(this.httpService
      .get(`${this.apiUrl}/user/by-username/${username}`)
      .pipe(map(response => response.data)));
    return response;
  }

  async getSets() {
    const response = await lastValueFrom(this.httpService.get(`${this.apiUrl}/sets`).pipe(map(response => response.data)));
    return response;
  }

  async getSetById(id: string) {
    const response = await lastValueFrom(this.httpService.get(`${this.apiUrl}/set/by-id/${id}`).pipe(map(response => response.data)));
    return response;
  }

  async getBuildableSets(username: string): Promise<Set[]> {
    const user = await this.getUserByUsername(username);
    const sets = await this.getSets();

    const userInventory = this.transformInventory(user.inventory);

    const buildableSets = [];
    for (const set of sets) {
      const fullSet = await this.getSetById(set.id);
      if (this.canBuildSet(fullSet, userInventory)) {
        buildableSets.push(fullSet);
      }
    }
    return buildableSets;
  }

  private transformInventory(inventory) {
    const transformed = {};
    inventory.forEach(item => {
      const key = `${item.brick.id}_${item.brick.colorId}`;
      transformed[key] = item.count;
    });
    return transformed;
  }

  private canBuildSet(set: Set, userInventory): boolean {
    const setInventory = this.transformInventory(set.bricks);
    for (const key in setInventory) {
      if (!userInventory[key] || userInventory[key] < setInventory[key]) {
        return false;
      }
    }
    return true;
  }
}

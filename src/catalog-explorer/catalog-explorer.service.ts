import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { Set, Brick } from './catalog-explorer.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CatalogExplorerService {
  private apiUrl = 'https://d16m5wbro86fg2.cloudfront.net/api';

  constructor(private readonly httpService: HttpService) {}

  async getUserByUsername(username: string) {
    const response = await lastValueFrom(this.httpService
      .get(`${this.apiUrl}/user/by-username/${username}`)
      .pipe(map(response => response.data)));
    return response;
  }

  async getSets() {
    const response = await lastValueFrom(this.httpService.get(`${this.apiUrl}/sets`).pipe(
      map(response => response.data)));
    return response;
  }

  async getSetById(id: string) {
    const response = await lastValueFrom(this.httpService.get(`${this.apiUrl}/set/by-id/${id}`).pipe(
      map(response => response.data)));
    return response;
  }

  async getBuildableSets(username: string): Promise<Set[]> {
    const user = await this.getUserByUsername(username);
    const sets = await this.getSets();

    const userInventory = this.transformUserInventory(user.collection);

    const buildableSets = [];
    for (const set of sets) {
      const fullSet = await this.getSetById(set.id);
      if (this.canBuildSet(fullSet, userInventory)) {
        buildableSets.push(fullSet);
      }
    }
    return buildableSets;
  }

  protected transformUserInventory(collection) {
    const transformed = {};
    collection.forEach(item => {
      item.variants.forEach(variant => {
        const key = `${item.pieceId}_${variant.color}`;
        transformed[key] = variant.count;
      })
    });
    return transformed;
  }

  protected transformSetInventory(pieces) {
    const transformed = {};
    pieces.forEach(piece => {
      const key = `${piece.part.designID}_${piece.part.material}`;
      transformed[key] = piece.quantity;
    });

    return transformed;
  }

  private canBuildSet(set: Set, userInventory): boolean {
    const setInventory = this.transformSetInventory(set.pieces);
    for (const key in setInventory) {
      if (!userInventory[key] || userInventory[key] < setInventory[key]) {
        return false;
      }
    }
    return true;
  }
}

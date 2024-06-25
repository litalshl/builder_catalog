import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { Set, FullSet, User } from './catalog-explorer.dto';

@Injectable()
export class CatalogExplorerService {
  private apiUrl = 'https://d16m5wbro86fg2.cloudfront.net/api';

  constructor() {}

  async getUserByUsername(username: string): Promise<User> {
    const response = await (await fetch(`${this.apiUrl}/user/by-username/${username}`));
    const data = await response.json();
    return data as User;
  }

  async getSets() : Promise<Set[]> {
    const response = await (await fetch(`${this.apiUrl}/sets`));
    const data = await response.json();
    return data as Set[];
  }

  async getSetById(id: string) : Promise<FullSet> {
    const response = await (await fetch(`${this.apiUrl}/set/by-id/${id}`));
    const data = await response.json();
    return data as FullSet;
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

  private canBuildSet(set: FullSet, userInventory): boolean {
    const setInventory = this.transformSetInventory(set.pieces);
    for (const key in setInventory) {
      if (!userInventory[key] || userInventory[key] < setInventory[key]) {
        return false;
      }
    }
    return true;
  }
}

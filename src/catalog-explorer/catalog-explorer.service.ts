import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { Set, FullSet, User } from './catalog-explorer.dto';

@Injectable()
export class CatalogExplorerService {
  private readonly logger = new Logger(CatalogExplorerService.name);
  private apiUrl = 'https://d16m5wbro86fg2.cloudfront.net/api';

  constructor() {}

  async getUserByUsername(username: string): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/user/by-username/${username}`);
      if (!response.ok) {
        this.logger.error(`Failed to fetch user by username: ${username}, Status: ${response.status}`);
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      return data as User;
    } catch (error) {
      this.logger.error(`Error fetching user by username: ${username}`, error.stack);
      throw error;
    }
  }

  async getUserDetailsById(id: string): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/user/by-id/${id}`);
      if (!response.ok) {
        this.logger.error(`Failed to fetch user by id: ${id}, Status: ${response.status}`);
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      return data as User;
    } catch (error) {
      this.logger.error(`Error fetching user by id: ${id}`, error.stack);
      throw error;
    }
  }

  async getSets(): Promise<Set[]> {
    try {
      const response = await fetch(`${this.apiUrl}/sets`);
      if (!response.ok) {
        this.logger.error(`Failed to fetch sets, Status: ${response.status}`);
        throw new Error('Failed to fetch sets');
      }
      const data = await response.json();
      return data.Sets as Set[];
    } catch (error) {
      this.logger.error('Error fetching sets', error.stack);
      throw error;
    }
  }

  async getSetById(id: string): Promise<FullSet> {
    try {
      const response = await fetch(`${this.apiUrl}/set/by-id/${id}`);
      if (!response.ok) {
        this.logger.error(`Failed to fetch set by id: ${id}, Status: ${response.status}`);
        throw new Error('Failed to fetch set details');
      }
      const data = await response.json();
      return data as FullSet;
    } catch (error) {
      this.logger.error(`Error fetching set by id: ${id}`, error.stack);
      throw error;
    }
  }

  async getBuildableSets(username: string): Promise<Set[]> {
    try {
      const user = await this.getUserByUsername(username);
      const userDetails = await this.getUserDetailsById(user.id);
      const sets: Set[] = await this.getSets();

      this.logger.log(`Fetched ${sets.length} sets`);

      const userInventory = this.transformUserInventory(userDetails.collection);
      const buildableSets = [];

      for (const set of sets) {
        const fullSet = await this.getSetById(set.id);
        if (this.canBuildSet(fullSet, userInventory)) {
          buildableSets.push(fullSet);
        }
      }

      this.logger.log(`Found ${buildableSets.length} buildable sets for user: ${username}`);
      return buildableSets;
    } catch (error) {
      this.logger.error(`Error getting buildable sets for user: ${username}`, error.stack);
      throw error;
    }
  }

  protected transformUserInventory(collection): any {
    const transformed = {};
    collection.forEach(item => {
      item.variants.forEach(variant => {
        const key = `${item.pieceId}_${variant.color}`;
        transformed[key] = variant.count;
      });
    });
    return transformed;
  }

  protected transformSetInventory(pieces): any {
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

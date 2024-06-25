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
      throw new Error(`User details not found for user id: ${id}`);
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
      if (!data.Sets) {
        throw new Error('Sets data is missing');
      }
      return data.Sets as Set[];
    } catch (error) {
      this.logger.error('Error fetching sets', error.stack);
      throw new Error('Sets data is not an array');
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
      if (!user) {
        this.logger.error(`User not found: ${username}`);
        throw new Error(`User not found: ${username}`);
      }

      const userDetails = await this.getUserDetailsById(user.id);
      if (!userDetails) {
        this.logger.error(`User details not found for user id: ${user.id}`);
        throw new Error(`User details not found for user id: ${user.id}`);
      }

      const sets = await this.getSets();
      if (!Array.isArray(sets)) {
        this.logger.error('Sets data is not an array');
        throw new Error('Sets data is not an array');
      }

      this.logger.log(`Fetched ${sets.length} sets`);

      const userInventory = this.transformUserInventory(userDetails.collection);
      const buildableSets = [];

      for (const set of sets) {
        const fullSet = await this.getSetById(set.id);
        const setInventory = this.transformSetInventory(fullSet.pieces);
        if (this.canBuildSet(setInventory, userInventory)) {
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

  private canBuildSet(setInventory, userInventory): boolean {
    
    for (const key in setInventory) {
      if (!userInventory[key] || userInventory[key] < setInventory[key]) {
        return false;
      }
    }
    return true;
  }
}

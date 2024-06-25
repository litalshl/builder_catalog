import { Test, TestingModule } from '@nestjs/testing';
import { CatalogExplorerService } from '../catalog-explorer.service';
import fetch from 'node-fetch';
import { mockFullSet1, mockFullSet2, mockSets, mockUser1, mockUser2 } from './mock-data';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('CatalogExplorerService', () => {
  let service: CatalogExplorerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogExplorerService],
    }).compile();

    service = module.get<CatalogExplorerService>(CatalogExplorerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should transform user collection correctly', () => {
    const transformed = service['defineUserInventory'](mockUser1.collection);
    expect(transformed).toEqual({
      '11211_155': 9,
      '11211_9': 4,
      '11211_5': 20,
      '36840_2': 15,
      '36840_155': 7,
      '36840_5': 15,
      '3023_2': 15,
      '3023_4': 11,
      '3023_5': 15,
      '3004_2': 15,
      '3004_155': 7,
      '3004_5': 15,
    });
  });

  it('should transform set pieces correctly', () => {
    const transformed = service['defineSetInventory'](mockFullSet1.pieces);
    expect(transformed).toEqual({
      '11211_5': 18,
      '36840_5': 10,
    });
  });

  describe('getBuildableSets', () => {
    it('should return buildable sets for the user', async () => {
      (fetch as jest.MockedFunction<typeof fetch>)
        .mockResolvedValueOnce(new Response(JSON.stringify(mockUser1)))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockUser1)))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockSets)))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockFullSet1)))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockFullSet2)));

      const result = await service.getBuildableSets('brickfan35');
      expect(result).toEqual([mockFullSet1, mockFullSet2]);
    });

    it('should return an empty array if no sets can be built', async () => {
      (fetch as jest.MockedFunction<typeof fetch>)
        .mockResolvedValueOnce(new Response(JSON.stringify(mockUser2)))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockUser2)))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockSets)))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockFullSet1)))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockFullSet2)));

      const result = await service.getBuildableSets('brickfan22');
      expect(result).toEqual([]);
    });
  });
});

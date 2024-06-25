import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CatalogExplorerService } from '../catalog-explorer.service';
import { mockFullSet1, mockFullSet2, mockUser1, mockUser2 } from './mocks/mock-data'
import { setupHttpServiceMock } from './mocks/mock-http-service';

describe('CatalogExplorerService', () => {
  let service: CatalogExplorerService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogExplorerService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatalogExplorerService>(CatalogExplorerService);
    httpService = module.get<HttpService>(HttpService);

    setupHttpServiceMock(httpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should transform user collection correctly', () => {
    const transformed = service['transformUserInventory'](mockUser1.collection);
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
      '3004_5': 15
    });
  });

  it('should transform set pieces correctly', () => {
    const transformed = service['transformSetInventory'](mockFullSet1.pieces);
    expect(transformed).toEqual({
      '11211_5': 18,
      '36840_5': 10
    });
  });

  describe('getBuildableSets', () => {
    it('should return buildable sets for the user', async () => {
      const result = await service.getBuildableSets('brickfan35');
      expect(result).toEqual([mockFullSet1, mockFullSet2]);
    });

    it('should return an empty array if no sets can be built', async () => {
      const result = await service.getBuildableSets('brickfan22');
      expect(result).toEqual([]);
    });
  });
});

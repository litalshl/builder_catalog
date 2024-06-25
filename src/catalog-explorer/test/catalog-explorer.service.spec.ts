import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CatalogExplorerService } from '../catalog-explorer.service';
import { mockFullSet1, mockFullSet2 } from './mocks/mock-data'
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

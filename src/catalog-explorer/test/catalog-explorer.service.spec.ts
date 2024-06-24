import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CatalogExplorerService } from '../catalog-explorer.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBuildableSets', () => {
    it('should return buildable sets for the user', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        inventory: [
          { count: 10, brick: { id: 'brick1', colorId: 'color1' } },
          { count: 5, brick: { id: 'brick2', colorId: 'color2' } },
        ],
      };

      const mockSets = [
        { id: 'set1', name: 'Set 1' },
        { id: 'set2', name: 'Set 2' },
      ];

      const mockFullSet1 = {
        id: 'set1',
        name: 'Set 1',
        bricks: [
          { count: 5, brick: { id: 'brick1', colorId: 'color1' } },
          { count: 5, brick: { id: 'brick2', colorId: 'color2' } },
        ],
      };

      const mockFullSet2 = {
        id: 'set2',
        name: 'Set 2',
        bricks: [
          { count: 10, brick: { id: 'brick1', colorId: 'color1' } },
          { count: 5, brick: { id: 'brick2', colorId: 'color2' } },
        ],
      };

      const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined
        },
      });

      jest.spyOn(httpService, 'get').mockImplementation((url: string) => {
        switch (url) {
          case 'https://d16m5wbro86fg2.cloudfront.net/api/user/by-username/johndoe':
            return of(mockAxiosResponse(mockUser));
          case 'https://d16m5wbro86fg2.cloudfront.net/api/sets':
            return of(mockAxiosResponse(mockSets));
          case 'https://d16m5wbro86fg2.cloudfront.net/api/set/by-id/set1':
            return of(mockAxiosResponse(mockFullSet1));
          case 'https://d16m5wbro86fg2.cloudfront.net/api/set/by-id/set2':
            return of(mockAxiosResponse(mockFullSet2));
          default:
            return of(mockAxiosResponse(null));
        }
      });

      const result = await service.getBuildableSets('johndoe');
      expect(result).toEqual([mockFullSet1, mockFullSet2]);
    });

    it('should return an empty array if no sets can be built', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        inventory: [
          { count: 1, brick: { id: 'brick1', colorId: 'color1' } },
        ],
      };

      const mockSets = [
        { id: 'set1', name: 'Set 1' },
        { id: 'set2', name: 'Set 2' },
      ];

      const mockFullSet1 = {
        id: 'set1',
        name: 'Set 1',
        bricks: [
          { count: 5, brick: { id: 'brick1', colorId: 'color1' } },
          { count: 5, brick: { id: 'brick2', colorId: 'color2' } },
        ],
      };

      const mockFullSet2 = {
        id: 'set2',
        name: 'Set 2',
        bricks: [
          { count: 10, brick: { id: 'brick1', colorId: 'color1' } },
          { count: 5, brick: { id: 'brick2', colorId: 'color2' } },
        ],
      };

      const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined
        },
      });

      jest.spyOn(httpService, 'get').mockImplementation((url: string) => {
        switch (url) {
          case 'https://d16m5wbro86fg2.cloudfront.net/api/user/by-username/johndoe':
            return of(mockAxiosResponse(mockUser));
          case 'https://d16m5wbro86fg2.cloudfront.net/api/sets':
            return of(mockAxiosResponse(mockSets));
          case 'https://d16m5wbro86fg2.cloudfront.net/api/set/by-id/set1':
            return of(mockAxiosResponse(mockFullSet1));
          case 'https://d16m5wbro86fg2.cloudfront.net/api/set/by-id/set2':
            return of(mockAxiosResponse(mockFullSet2));
          default:
            return of(mockAxiosResponse(null));
        }
      });

      const result = await service.getBuildableSets('johndoe');
      expect(result).toEqual([]);
    });
  });
});

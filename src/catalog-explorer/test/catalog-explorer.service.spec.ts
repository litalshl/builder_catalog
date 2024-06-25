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
        "id": "1",
        "username": "brickfan35",
        "location": "UKY",
        "brickCount": 1413,
        "collection": [
            {
                "pieceId": "3710",
                "variants": [
                    {
                        "color": "155",
                        "count": 9
                    },
                    {
                        "color": "152",
                        "count": 7
                    },
                    {
                        "color": "2",
                        "count": 8
                    },
                    {
                        "color": "7",
                        "count": 8
                    },
                    {
                        "color": "9",
                        "count": 4
                    },
                    {
                        "color": "5",
                        "count": 3
                    },
                    {
                        "color": "1",
                        "count": 6
                    },
                    {
                        "color": "34",
                        "count": 11
                    },
                    {
                        "color": "3",
                        "count": 8
                    }
                ]
            },
            {
                "pieceId": "3005",
                "variants": [
                    {
                        "color": "2",
                        "count": 15
                    },
                    {
                        "color": "155",
                        "count": 7
                    },
                    {
                        "color": "152",
                        "count": 9
                    },
                    {
                        "color": "5",
                        "count": 6
                    },
                    {
                        "color": "1",
                        "count": 4
                    },
                    {
                        "color": "9",
                        "count": 6
                    },
                    {
                        "color": "7",
                        "count": 2
                    },
                    {
                        "color": "3",
                        "count": 14
                    },
                    {
                        "color": "34",
                        "count": 4
                    }
                ]
              }
            ]
      };

      const mockSets = {
        "Sets": [
        {
            "id": "040f11ab-e301-4724-bacd-50841816e06b",
            "name": "alien-spaceship",
            "setNumber": "497XX",
            "totalPieces": 1050
        },
        {
            "id": "c33d995e-d4e8-4dd3-8857-07438c29b0de",
            "name": "beach-buggy",
            "setNumber": "134XX",
            "totalPieces": 780
        }
      ]
    };

      const mockFullSet1 = {
        "id": "1",
        "name": "alien-spaceship",
        "setNumber": "497XX",
        "pieces": [
          {
            "part": {
                "designID": "11211",
                "material": 5,
                "partType": "rigid"
            },
            "quantity": 18
          },
          {
            "part": {
                "designID": "36840",
                "material": 5,
                "partType": "rigid"
            },
            "quantity": 10
          }
        ]
      };

      const mockFullSet2 = {
        "id": "2",
        "name": "beach-buggy",
        "setNumber": "134XX",
        "pieces": [
          {
            "part": {
                "designID": "3004",
                "material": 5,
                "partType": "rigid"
            },
            "quantity": 9
          },
          {
            "part": {
                "designID": "3023",
                "material": 4,
                "partType": "rigid"
            },
            "quantity": 7
          },
          {
            "part": {
                "designID": "36840",
                "material": 5,
                "partType": "rigid"
            },
            "quantity": 9
          },
          {
            "part": {
                "designID": "36840",
                "material": 4,
                "partType": "rigid"
            },
            "quantity": 7
          },
          {
            "part": {
                "designID": "77232",
                "material": 4,
                "partType": "rigid"
            },
            "quantity": 8
          },
          {
            "part": {
                "designID": "22888",
                "material": 5,
                "partType": "rigid"
            },
            "quantity": 4
          },
          {
            "part": {
                "designID": "3023",
                "material": 5,
                "partType": "rigid"
            },
            "quantity": 9
          }
        ]
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

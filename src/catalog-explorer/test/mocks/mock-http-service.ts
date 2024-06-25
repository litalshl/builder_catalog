import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { mockUser1, mockUser2, mockSets, mockFullSet1, mockFullSet2 } from './mock-data';

export const mockAxiosResponse = (data: any): AxiosResponse => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: null,
});

export const setupHttpServiceMock = (httpService: HttpService) => {
  jest.spyOn(httpService, 'get').mockImplementation((url: string) => {
    switch (url) {
      case 'https://d16m5wbro86fg2.cloudfront.net/api/user/by-username/brickfan35':
        return of(mockAxiosResponse(mockUser1));
      case 'https://d16m5wbro86fg2.cloudfront.net/api/user/by-username/brickfan22':
          return of(mockAxiosResponse(mockUser2));
      case 'https://d16m5wbro86fg2.cloudfront.net/api/sets':
        return of(mockAxiosResponse(mockSets));
      case 'https://d16m5wbro86fg2.cloudfront.net/api/set/by-id/1':
        return of(mockAxiosResponse(mockFullSet1));
      case 'https://d16m5wbro86fg2.cloudfront.net/api/set/by-id/2':
        return of(mockAxiosResponse(mockFullSet2));
      default:
        return of(mockAxiosResponse(null));
    }
  });
};

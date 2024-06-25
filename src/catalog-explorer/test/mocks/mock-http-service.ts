import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { mockUser, mockSets, mockFullSet1, mockFullSet2 } from './mock-data';

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
};

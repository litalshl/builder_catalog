import { Module } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CatalogExplorerService } from './catalog-explorer.service';
import { CatalogExplorerResolver } from './catalog-explorer.resolver';

@Module({
  imports: [HttpService],
  providers: [CatalogExplorerService, CatalogExplorerResolver],
})
export class CatalogExplorerModule {}

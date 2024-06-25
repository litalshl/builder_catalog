import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatalogExplorerService } from './catalog-explorer.service';
import { CatalogExplorerResolver } from './catalog-explorer.resolver';

@Module({
  imports: [HttpModule],
  providers: [CatalogExplorerService, CatalogExplorerResolver],
})
export class CatalogExplorerModule {}

import { Resolver, Query, Args } from '@nestjs/graphql';
import { CatalogExplorerService } from './catalog-explorer.service';
import { Set } from './catalog-explorer.dto';

@Resolver()
export class CatalogExplorerResolver {
  constructor(private readonly catalogExplorerService: CatalogExplorerService) {}

  @Query(() => [Set])
  async getBuildableSets(@Args('username') username: string) {
    return this.catalogExplorerService.getBuildableSets(username);
  }
}

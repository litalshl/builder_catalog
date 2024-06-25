import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Brick {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  width: number;

  @Field(() => Int)
  length: number;

  @Field()
  colorId: string;
}

@ObjectType()
export class Set {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [Brick])
  pieces: Brick[];
}

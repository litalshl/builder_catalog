import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {

  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  location: string;

  @Field()
  brickCount: number;

  @Field(() => [Piece])
  collection: Piece[];

}

@ObjectType()
export class Piece {

  @Field()
  pieceId: string;

  @Field(() => [Variant])
  variants: Variant[];

}

@ObjectType()
export class Variant {

  @Field()
  color: string;

  @Field()
  count: number;
}

@ObjectType()
export class Part{

  @Field()
  designID : string;

  @Field()
  material : number;

  @Field()
  partType : string;
}

@ObjectType()
export class SetPiece {

  @Field()
  part: Part;

  @Field()
  quantity: number;
}

@ObjectType()
export class Set {

  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  setNumber: string;

  @Field()
  totalPieces: number;
}

@ObjectType()
export class FullSet extends Set {

  @Field(() => [Piece])
  pieces: Piece[];
}

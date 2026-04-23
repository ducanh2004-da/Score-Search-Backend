import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class SubjectLevelStat {
  @Field(() => String)
  subject!: string;

  @Field(() => Int)
  level1!: number; 

  @Field(() => Int)
  level2!: number; 

  @Field(() => Int)
  level3!: number; 

  @Field(() => Int)
  level4!: number; 
}

@ObjectType()
export class SubjectLevelStatResponse {
    @Field(() => Boolean)
    isSuccess!: boolean;

    @Field(() => String)
    message!: string;

    @Field(() => [SubjectLevelStat])
    stat!: SubjectLevelStat[];
}

@ObjectType()
export class TopStudentGroupA {
  @Field(() => String)
  sbd!: string;

  @Field(() => Float)
  totalScore!: number;
}

@ObjectType()
export class Top10Response {
    @Field(() => Boolean)
    isSuccess!: boolean;

    @Field(() => String)
    message!: string;

    @Field(() => [TopStudentGroupA])
    student!: TopStudentGroupA[];
}
import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Score{
    @Field(() => String)
    sbd!: string;

    @Field(() => Float, {nullable: true})
    toan?: number | null;

    @Field(() => Float, {nullable: true})
    ngu_van?: number | null;

    @Field(() => Float, {nullable: true})
    ngoai_ngu?: number | null;

    @Field(() => Float, {nullable: true})
    vat_li?: number|  null;

    @Field(() => Float, {nullable: true})
    hoa_hoc?: number | null;

    @Field(() => Float, {nullable: true})
    sinh_hoc?: number | null;

    @Field(() => Float, {nullable: true})
    lich_su?: number | null;

    @Field(() => Float, {nullable: true})
    dia_li?: number | null;

    @Field(() => Float, {nullable: true})
    gdcd?: number | null;

    @Field(() => String, {nullable: true})
    ma_ngoai_ngu?: string | null;
}

@ObjectType()
export class ScoreResponse {
    @Field(() => Boolean)
    isSuccess!: boolean;

    @Field(() => String)
    message!: string;

    @Field(() => [Score])
    score!: Score[];

}

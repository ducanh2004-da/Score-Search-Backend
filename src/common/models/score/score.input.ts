import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, Length, Matches } from 'class-validator';

@InputType()
export class SearchScore {
    @Field(() => String)
    @IsString({message: "This field must be string"})
    @Length(1, 11, {message: 'ID must between 1 to 11 character'})
    @Matches(/^[0-9]+$/, { message: 'Only accept number' })
    sbd!: string;
}
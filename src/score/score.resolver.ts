import { Resolver, Query, Args } from '@nestjs/graphql';
import { ScoreResponse } from 'src/common/models/score/score.dto';
import { ScoreService } from './score.service';
import { SearchScore } from 'src/common/models/score/score.input';
import { Inject } from '@nestjs/common';
import { SCORE_SERVICE_TOKEN } from './score.interface';
import type { IScoreService } from './score.interface';
import { Top10Response, TopStudentGroupA } from 'src/common/models/report/report.dto';

@Resolver(() => ScoreResponse)
export class ScoreResolver {
  constructor(
    @Inject(SCORE_SERVICE_TOKEN) private readonly scoreService: IScoreService,
  ) {}
  @Query(() => String)
  async getScore() {
    return 'Hello từ GraphQL!';
  }

  @Query(() => ScoreResponse)
  async getScoreBySbd(
    @Args('data', { type: () => SearchScore }) data: SearchScore,
  ): Promise<ScoreResponse> {
    return this.scoreService.findBySbd(data.sbd);
  }

  @Query(() => Top10Response, { name: 'getTop10GroupA' })
  async getTop10(): Promise<Top10Response> {
    return this.scoreService.getTop10A();
  }
}

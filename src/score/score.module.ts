import { Module } from '@nestjs/common';
import { ScoreResolver } from './score.resolver';
import { ScoreService } from './score.service';
import { SCORE_SERVICE_TOKEN } from './score.interface';
import { ScoreDAO } from './score.dao';

@Module({
  providers: [
    ScoreResolver, 
    ScoreDAO,
    {
      provide: SCORE_SERVICE_TOKEN,
      useClass: ScoreService
    }
  ],
  exports: [SCORE_SERVICE_TOKEN]
})
export class ScoreModule {}

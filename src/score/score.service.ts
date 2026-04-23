import { Inject, Injectable } from '@nestjs/common';
import { ScoreDAO } from './score.dao';
import { ScoreResponse } from 'src/common/models/score/score.dto';
import { IScoreService } from './score.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import {
  SubjectLevelStatResponse,
  Top10Response,
} from 'src/common/models/report/report.dto';
import {
  ChemistryAnalyzer,
  LiteratureAnalyzer,
  MathAnalyzer,
  PhysicsAnalyzer,
} from './domain/subject.analyze';

@Injectable()
export class ScoreService implements IScoreService {
  constructor(
    private readonly scoreDao: ScoreDAO,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findBySbd(sbd: string): Promise<ScoreResponse> {
    if (!sbd) {
      return {
        isSuccess: false,
        message: 'SBD must have value',
        score: [],
      };
    }
    const score = await this.scoreDao.findBySbd(sbd);
    if (!score) {
      return {
        isSuccess: false,
        message: 'Score result is empty',
        score: [],
      };
    }
    return {
      isSuccess: true,
      message: 'Retrieved score successfully',
      score: [score],
    };
  }

  async getReportStats(): Promise<SubjectLevelStatResponse> {
    const cacheKey = 'score:report:stats';
    const cachedStat = await this.cacheManager.get(cacheKey);
    if (cachedStat) {
      return {
        isSuccess: true,
        message: 'Retrieved stats from cache successfully',
        stat: cachedStat as any,
      };
    }

    const analyzers = [
      new MathAnalyzer(),
      new PhysicsAnalyzer(),
      new ChemistryAnalyzer(),
      new LiteratureAnalyzer(),
    ];

    const statPromises = analyzers.map(async (analyzer) => {
      const rawStat = await this.scoreDao.getSubjectLevelStats(
        analyzer.subjectDbColumn,
      );
      return analyzer.analyze(rawStat);
    });

    const stat = await Promise.all(statPromises);

    await this.cacheManager.set(cacheKey, stat, 86400000);

    return {
      isSuccess: true,
      message: 'Retrieved stats from DB successfully',
      stat: stat,
    };
  }

  async getTop10A(): Promise<Top10Response> {
    const cacheKey = 'score:top10:blockA';

    const cachedTopStudents = await this.cacheManager.get(cacheKey);
    if (cachedTopStudents) {
      return {
        isSuccess: true,
        message: 'Retrieved top 10 from cache successfully',
        student: cachedTopStudents as any,
      };
    }

    const topStudents = await this.scoreDao.getTop10A();
    
    if (!topStudents || topStudents.length === 0) {
      return {
        isSuccess: false,
        message: 'Do not have any student',
        student: [],
      };
    }

    await this.cacheManager.set(cacheKey, topStudents, 86400000);

    return {
      isSuccess: true,
      message: 'Retrieved top 10 from DB successfully',
      student: topStudents,
    };
  }
}

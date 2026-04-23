import { Injectable } from '@nestjs/common';
import { ScoreDAO } from './score.dao';
import {
  ScoreResponse,
} from 'src/common/models/score/score.dto';
import { IScoreService } from './score.interface';
import { Top10Response } from 'src/common/models/report/report.dto';

@Injectable()
export class ScoreService implements IScoreService {
  constructor(private readonly scoreDao: ScoreDAO) {}

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

  async getTop10A(): Promise<Top10Response> {
    const student = await this.scoreDao.findValidScoreA();

    if(!student){
        return{
            isSuccess: false,
            message: 'Do not have any student',
            student: []
        }
    }

    const mapStudentScore = student.map((s) => ({
      sbd: s.sbd,
      totalScore: s.toan! + s.vat_li! + s.hoa_hoc!,
    }));

    const studentSort = mapStudentScore
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);

    return{
        isSuccess: true,
        message: 'Retrieved student successfully',
        student: studentSort
    }
  }
}

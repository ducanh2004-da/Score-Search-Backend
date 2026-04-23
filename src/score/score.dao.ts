import { Injectable, NotFoundException } from '@nestjs/common';
import { Score } from '@prisma/client';
import { SearchScore } from 'src/common/models/score/score.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScoreDAO {
  constructor(private readonly prisma: PrismaService) {}

  async findBySbd(sbd: string): Promise<Score | null> {
    return this.prisma.score.findUnique({
      where: { sbd },
    });
  }

  async findValidScoreA(): Promise<Pick<Score, 'sbd' | 'toan' | 'vat_li' | 'hoa_hoc'>[]>{
    return this.prisma.score.findMany({
        where:{
            toan: { not: null },
            vat_li: { not: null },
            hoa_hoc: { not: null }
        },
        select: {
            sbd: true,
            toan: true,
            vat_li: true,
            hoa_hoc: true
        }
    })
  }
}

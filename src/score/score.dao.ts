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

async getTop10A(): Promise<{ sbd: string; totalScore: number }[]> {
    return this.prisma.$queryRaw`
      SELECT sbd, (toan + vat_li + hoa_hoc) AS "totalScore"
      FROM "scores" 
      WHERE toan IS NOT NULL 
        AND vat_li IS NOT NULL 
        AND hoa_hoc IS NOT NULL
      ORDER BY "totalScore" DESC
      LIMIT 10;
    `;
  }

async getSubjectLevelStats(columnName: string) {
    const query = `
      SELECT
        COUNT(CASE WHEN "${columnName}" >= 8 THEN 1 END)::int as level1,
        COUNT(CASE WHEN "${columnName}" >= 6 AND "${columnName}" < 8 THEN 1 END)::int as level2,
        COUNT(CASE WHEN "${columnName}" >= 4 AND "${columnName}" < 6 THEN 1 END)::int as level3,
        COUNT(CASE WHEN "${columnName}" < 4 THEN 1 END)::int as level4
      FROM "scores" 
      WHERE "${columnName}" IS NOT NULL;
    `;
    
    const result = await this.prisma.$queryRawUnsafe(query) as Array<{ level1: number; level2: number; level3: number; level4: number; }>;
    return result[0]; 
  }
}

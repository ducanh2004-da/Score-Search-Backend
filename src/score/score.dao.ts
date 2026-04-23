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

  // score.dao.ts
async getSubjectLevelStats(columnName: string) {
  // Thực thi câu lệnh đếm trực tiếp trên Database
  const query = `
    SELECT
      COUNT(CASE WHEN "${columnName}" >= 8 THEN 1 END)::int as level1,
      COUNT(CASE WHEN "${columnName}" >= 6 AND "${columnName}" < 8 THEN 1 END)::int as level2,
      COUNT(CASE WHEN "${columnName}" >= 4 AND "${columnName}" < 6 THEN 1 END)::int as level3,
      COUNT(CASE WHEN "${columnName}" < 4 THEN 1 END)::int as level4
    FROM scores
    WHERE "${columnName}" IS NOT NULL;
  `;
  
  const result = await this.prisma.$queryRawUnsafe(query) as Array<{ level1: number; level2: number; level3: number; level4: number; }>;
  return result[0]; // Prisma trả về mảng, ta lấy object đầu tiên chứa kết quả đếm
}
}

import { SubjectLevelStat } from "src/common/models/report/report.dto";

export abstract class SubjectAnalyzer {
  constructor(protected readonly subjectDbColumn: string, public readonly subjectDisplayName: string) {}

  public analyze(scores: any[]): SubjectLevelStat {
    const stat: SubjectLevelStat = { 
        subject: this.subjectDisplayName, 
        level1: 0, level2: 0, level3: 0, level4: 0 
    };

    for (const row of scores) {
      const point = row[this.subjectDbColumn];
      if (point === null || point === undefined) continue;

      if (point >= 8) stat.level1++;
      else if (point >= 6) stat.level2++;
      else if (point >= 4) stat.level3++;
      else stat.level4++;
    }
    return stat;
  }
}

export class MathAnalyzer extends SubjectAnalyzer {
  constructor() { super('toan', 'Toán Học'); }
}

export class PhysicsAnalyzer extends SubjectAnalyzer {
  constructor() { super('vat_li', 'Vật Lí'); }
}

export class ChemistryAnalyzer extends SubjectAnalyzer {
  constructor() { super('hoa_hoc', 'Hóa Học'); }
}

export class LiteratureAnalyzer extends SubjectAnalyzer {
  constructor() { super('ngu_van', 'Ngữ Văn'); }
}

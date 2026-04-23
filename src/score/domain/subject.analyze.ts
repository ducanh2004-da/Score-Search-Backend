// subject.analyzer.ts
import { SubjectLevelStat } from "src/common/models/report/report.dto";

export abstract class SubjectAnalyzer {
  constructor(
    public readonly subjectDbColumn: string, // Đổi sang public để Service có thể gọi
    public readonly subjectDisplayName: string
  ) {}

  // Nhận kết quả đã tính toán từ DB và format lại
  public analyze(dbResult: any): SubjectLevelStat {
    return { 
        subject: this.subjectDisplayName, 
        level1: dbResult.level1 || 0, 
        level2: dbResult.level2 || 0, 
        level3: dbResult.level3 || 0, 
        level4: dbResult.level4 || 0 
    };
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
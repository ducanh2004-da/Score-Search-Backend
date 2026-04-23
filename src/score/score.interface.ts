import { SubjectLevelStatResponse, Top10Response } from "src/common/models/report/report.dto";
import { ScoreResponse } from "src/common/models/score/score.dto";

export interface IScoreService {
    findBySbd(sbd: string): Promise<ScoreResponse>;
    getTop10A(): Promise<Top10Response>;
    getReportStats(): Promise<SubjectLevelStatResponse>;
}
export const SCORE_SERVICE_TOKEN = 'IScoreService'
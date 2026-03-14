export interface LessonRecord {
  id: string;
  date: string;
  studentName: string;
  grade: string;
  studyUnit: string;
  notes: string;
}

export type AIProvider = 'gpt' | 'claude';

export interface GenerateReportRequest {
  studentName: string;
  grade: string;
  month: number;
  year: number;
  records: Pick<LessonRecord, 'date' | 'studyUnit' | 'notes'>[];
  provider?: AIProvider;
}

export interface GenerateReportResponse {
  studySummary: string;
  comment1: string;
  comment2: string;
  comment3: string;
  comment4: string;
  nextPlan: string;
}

export interface ReportData extends GenerateReportResponse {
  studentName: string;
  grade: string;
  month: number;
  year: number;
  records: Pick<LessonRecord, 'date' | 'studyUnit' | 'notes'>[];
  provider?: AIProvider;
}

export type StationType = 'DUG' | 'PZ';
export type Language = 'en' | 'bn' | 'hi';

export interface HydroStation {
  id: number;
  district: string;
  block: string;
  location: string;
  pincode: string;
  post_office: string;
  village: string;
  type: StationType;
  pre_depth: number; // meters below ground level (mbgl)
  trend_fall: number; // m/year fall
  trend_rise: number; // m/year rise
  risk: number; // 0-100 risk score
  lat: number;
  lng: number;
  terrain: string;
  note: string;
}

export interface PincodeEntry {
  pincode: string;
  post_office: string;
  district: string;
  block: string;
  lat: number;
  lng: number;
  villages: string[];
}

export interface AdvisoryResponse {
  formationAnalysis: string;
  preDrillingAdvice: string[];
  contractorQuestions: string[];
  waterQualityNotes: string;
  riskAssessment: {
    level: 'Low' | 'Moderate' | 'High' | 'Critical';
    rationale: string;
    recommendedDepth: string;
  };
  isLiveAi?: boolean;
  modelUsed?: string;
}

export interface ResumeData {
  name: string;
  englishName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  emergencyContact: string;
  address: string;
  photo: string;
  desiredJob: string;
  education: string;
  workExperience: string;
  coreCompetencies: string;
  certifications: string;
}

export type ResumeTemplateId = 'classic' | 'modern';
export type ResumeCareerType = 'basic' | 'senior';

export interface ResumeEducationItem {
  schoolName: string;
  major: string;
  period: string;
  graduationStatus: string;
  details: string;
}

export interface ResumeWorkExperienceItem {
  companyName: string;
  period: string;
  mainTask: string;
  leavingReason: string;
}

export interface ResumeCertificationItem {
  certificationName: string;
  period: string;
  institution: string;
}

export interface ResumeCoreCompetencyItem {
  fullDescription: string;
  period: string;
  courseName: string;
  institution: string;
}

export interface ResumeFormatResult {
  name: string;
  englishName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  emergencyContact: string;
  address: string;
  photo: string;
  desiredJob: string;
  education: ResumeEducationItem[];
  workExperience: ResumeWorkExperienceItem[];
  coreCompetencies: ResumeCoreCompetencyItem[];
  certifications: ResumeCertificationItem[];
}

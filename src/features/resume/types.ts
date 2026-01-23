export interface Education {
  schoolName: string;
  major: string;
  period: string;
  graduationStatus: string;
  details: string;
  fullDescription: string;
}

export interface WorkExperience {
  companyName: string;
  period: string;
  mainTask: string;
  leavingReason?: string;
  fullDescription: string;
}

export interface CoreCompetencies {
  fullDescription: string;
  period: string;
  courseName: string;
  institution: string;
}

export interface Certifications {
  fullDescription: string;
  period: string;
  certificationName: string;
  institution: string;
}

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
  education: Education[];
  workExperience: WorkExperience[];
  coreCompetencies: CoreCompetencies[];
  certifications: Certifications[];
}

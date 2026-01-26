export interface Education {
  fullDescription: string;
}

export interface WorkExperience {
  fullDescription: string;
}

export interface CoreCompetencies {
  fullDescription: string;
}

export interface Certifications {
  fullDescription: string;
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

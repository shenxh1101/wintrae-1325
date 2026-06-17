export type PetType = 'dog' | 'cat' | 'other';
export type PetGender = 'male' | 'female';
export type VaccineStatus = 'completed' | 'pending' | 'expired';

export interface VaccineRecord {
  id: string;
  name: string;
  date: string;
  nextDate?: string;
  status: VaccineStatus;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  gender: PetGender;
  age: number;
  weight: number;
  avatar: string;
  birthday: string;
  neutered: boolean;
  vaccineStatus: VaccineStatus;
  vaccines: VaccineRecord[];
  dietaryRestrictions: string;
  personality: string;
  medicalHistory: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
}

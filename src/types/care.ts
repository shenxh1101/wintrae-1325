export type CareLogType = 'feeding' | 'walking' | 'cleaning' | 'medication' | 'grooming' | 'abnormal' | 'photo' | 'other';
export type AbnormalLevel = 'low' | 'medium' | 'high';

export interface CareMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface CareLog {
  id: string;
  orderId: string;
  orderNo?: string;
  petId: string;
  petName?: string;
  petAvatar?: string;
  type: CareLogType;
  title: string;
  content: string;
  timestamp: string;
  staffId: string;
  staffName: string;
  medias: CareMedia[];
  abnormalLevel?: AbnormalLevel;
  abnormalDetails?: string;
  handled?: boolean;
  handledAt?: string;
  handledBy?: string;
}

export interface CareTodo {
  id: string;
  orderId: string;
  petId: string;
  petName: string;
  type: CareLogType;
  title: string;
  scheduledTime: string;
  completed: boolean;
  completedAt?: string;
}

export interface CareSummary {
  date: string;
  feedingCount: number;
  walkingCount: number;
  cleaningCount: number;
  medicationCount: number;
  photoCount: number;
  abnormalCount: number;
}

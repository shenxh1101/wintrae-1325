import type { Pet } from '@/types/pet';

export const pets: Pet[] = [
  {
    id: 'p001',
    name: '豆豆',
    type: 'dog',
    breed: '金毛寻回犬',
    gender: 'male',
    age: 3,
    weight: 28.5,
    avatar: 'https://picsum.photos/id/237/200/200',
    birthday: '2023-05-15',
    neutered: true,
    vaccineStatus: 'completed',
    vaccines: [
      { id: 'v1', name: '狂犬疫苗', date: '2025-11-20', nextDate: '2026-11-20', status: 'completed' },
      { id: 'v2', name: '六联疫苗', date: '2025-11-20', nextDate: '2026-11-20', status: 'completed' },
      { id: 'v3', name: '体内驱虫', date: '2026-04-10', nextDate: '2026-07-10', status: 'completed' }
    ],
    dietaryRestrictions: '鸡肉过敏，避免含有鸡肉成分的食物；不能吃葡萄和巧克力',
    personality: '性格温顺，喜欢和人亲近，爱玩耍，陌生人友好，但对大型犬有点害怕',
    medicalHistory: '2024年曾因肠胃炎住院治疗一周，已完全康复',
    ownerId: 'u001',
    ownerName: '张小明',
    ownerPhone: '138****5678',
    createdAt: '2024-01-20'
  },
  {
    id: 'p002',
    name: '咪咪',
    type: 'cat',
    breed: '英国短毛猫',
    gender: 'female',
    age: 2,
    weight: 4.2,
    avatar: 'https://picsum.photos/id/40/200/200',
    birthday: '2024-02-28',
    neutered: true,
    vaccineStatus: 'completed',
    vaccines: [
      { id: 'v4', name: '狂犬疫苗', date: '2025-10-15', nextDate: '2026-10-15', status: 'completed' },
      { id: 'v5', name: '猫三联', date: '2025-10-15', nextDate: '2026-10-15', status: 'completed' }
    ],
    dietaryRestrictions: '挑食，只吃特定品牌猫粮；不爱喝水，需要督促饮水',
    personality: '比较独立，喜欢安静，不喜欢被抱，熟悉后会蹭人撒娇',
    medicalHistory: '健康，无重大疾病史',
    ownerId: 'u001',
    ownerName: '张小明',
    ownerPhone: '138****5678',
    createdAt: '2024-03-10'
  },
  {
    id: 'p003',
    name: '球球',
    type: 'dog',
    breed: '柯基',
    gender: 'male',
    age: 1,
    weight: 10.8,
    avatar: 'https://picsum.photos/id/1062/200/200',
    birthday: '2025-03-20',
    neutered: false,
    vaccineStatus: 'pending',
    vaccines: [
      { id: 'v6', name: '狂犬疫苗', date: '2025-09-15', nextDate: '2026-09-15', status: 'completed' },
      { id: 'v7', name: '六联疫苗', date: '2026-06-01', nextDate: '2027-06-01', status: 'pending' }
    ],
    dietaryRestrictions: '无特殊禁忌，食量较大需控制',
    personality: '活泼好动，精力旺盛，喜欢追逐小球，偶尔会拆家',
    medicalHistory: '健康，幼犬阶段常规疫苗已完成',
    ownerId: 'u001',
    ownerName: '张小明',
    ownerPhone: '138****5678',
    createdAt: '2025-05-15'
  }
];

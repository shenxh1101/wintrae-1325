import type { Order, AddonService } from '@/types/order';

export const addonServices: AddonService[] = [
  {
    id: 's001',
    name: '基础洗护',
    type: 'grooming',
    price: 88,
    description: '洗澡、吹干、梳理毛发、剪指甲、清洁耳道'
  },
  {
    id: 's002',
    name: '精致SPA',
    type: 'grooming',
    price: 168,
    description: '药浴护理、深层清洁、精油按摩、造型修剪'
  },
  {
    id: 's003',
    name: '上门接送',
    type: 'transport',
    price: 60,
    description: '30公里范围内专业宠物接送服务'
  },
  {
    id: 's004',
    name: '机场接送',
    type: 'transport',
    price: 150,
    description: '机场/高铁站宠物专车接送服务'
  },
  {
    id: 's005',
    name: '遛弯升级',
    type: 'other',
    price: 30,
    description: '每日遛弯从2次升级至4次，每次30分钟'
  },
  {
    id: 's006',
    name: '宠物摄像',
    type: 'other',
    price: 50,
    description: '每日高清视频通话2次，实时了解爱宠状态'
  }
];

export const orders: Order[] = [
  {
    id: 'o001',
    orderNo: 'FY20260618001',
    roomId: 'r003',
    petIds: ['p001'],
    checkinDate: '2026-06-18',
    checkoutDate: '2026-06-22',
    nights: 4,
    addonServices: [
      { id: 's001', name: '基础洗护', type: 'grooming', price: 88, description: '洗澡、吹干、梳理毛发、剪指甲、清洁耳道' },
      { id: 's003', name: '上门接送', type: 'transport', price: 60, description: '30公里范围内专业宠物接送服务' }
    ],
    status: 'care',
    paymentStatus: 'paid',
    depositAmount: 300,
    totalAmount: 1040,
    paidAmount: 1040,
    feeDetails: [
      { id: 'f1', name: '豪华观景房', amount: 198, quantity: 4, unit: '晚' },
      { id: 'f2', name: '基础洗护', amount: 88, quantity: 1, unit: '次' },
      { id: 'f3', name: '上门接送', amount: 60, quantity: 1, unit: '次' },
      { id: 'f4', name: '押金', amount: 300, quantity: 1, unit: '' }
    ],
    specialNotes: '豆豆每天需要至少1小时的户外活动时间，饮食上请避开鸡肉类食物',
    cageNumber: 'A-12',
    createdAt: '2026-06-15 14:30:00',
    confirmedAt: '2026-06-15 16:00:00',
    checkinTime: '2026-06-18 10:30:00'
  },
  {
    id: 'o002',
    orderNo: 'FY20260620001',
    roomId: 'r005',
    petIds: ['p002'],
    checkinDate: '2026-06-20',
    checkoutDate: '2026-06-25',
    nights: 5,
    addonServices: [
      { id: 's006', name: '宠物摄像', type: 'other', price: 50, description: '每日高清视频通话2次，实时了解爱宠状态' }
    ],
    status: 'confirmed',
    paymentStatus: 'deposit',
    depositAmount: 200,
    totalAmount: 990,
    paidAmount: 200,
    feeDetails: [
      { id: 'f5', name: '猫咪专属房', amount: 158, quantity: 5, unit: '晚' },
      { id: 'f6', name: '宠物摄像', amount: 50, quantity: 5, unit: '天' },
      { id: 'f7', name: '押金', amount: 200, quantity: 1, unit: '' }
    ],
    specialNotes: '咪咪比较胆小，刚入住时可能会躲起来，请不要强行抱她',
    createdAt: '2026-06-17 09:20:00',
    confirmedAt: '2026-06-17 10:00:00'
  },
  {
    id: 'o003',
    orderNo: 'FY20260605001',
    roomId: 'r001',
    petIds: ['p003'],
    checkinDate: '2026-06-05',
    checkoutDate: '2026-06-10',
    nights: 5,
    addonServices: [
      { id: 's002', name: '精致SPA', type: 'grooming', price: 168, description: '药浴护理、深层清洁、精油按摩、造型修剪' }
    ],
    status: 'completed',
    paymentStatus: 'refunded',
    depositAmount: 200,
    totalAmount: 808,
    paidAmount: 808,
    feeDetails: [
      { id: 'f8', name: '舒适标准间', amount: 88, quantity: 5, unit: '晚' },
      { id: 'f9', name: '精致SPA', amount: 168, quantity: 1, unit: '次' },
      { id: 'f10', name: '押金', amount: 200, quantity: 1, unit: '' }
    ],
    specialNotes: '球球精力旺盛，请多陪他玩耍，注意收好贵重物品',
    checkinTime: '2026-06-05 11:00:00',
    checkoutTime: '2026-06-10 15:30:00',
    createdAt: '2026-06-01 16:45:00',
    confirmedAt: '2026-06-01 17:30:00',
    completedAt: '2026-06-10 16:00:00',
    rating: 5,
    review: '服务非常好！每天都有照片和视频更新，球球回来的时候特别开心，毛发也护理得很好，下次还会再来！'
  }
];

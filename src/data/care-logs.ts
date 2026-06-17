import type { CareLog, CareTodo, CareSummary } from '@/types/care';

export const careLogs: CareLog[] = [
  {
    id: 'c001',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    petId: 'p001',
    petName: '豆豆',
    petAvatar: 'https://picsum.photos/id/237/200/200',
    type: 'feeding',
    title: '早餐喂食',
    content: '豆豆早餐食欲很好，吃完了满满一碗狗粮，饮水正常。今日精神状态良好，活泼好动。',
    timestamp: '2026-06-18 08:15:00',
    staffId: 'st001',
    staffName: '李护理',
    medias: [
      { id: 'm1', type: 'image', url: 'https://picsum.photos/id/237/600/600' }
    ]
  },
  {
    id: 'c002',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    petId: 'p001',
    petName: '豆豆',
    petAvatar: 'https://picsum.photos/id/237/200/200',
    type: 'walking',
    title: '上午遛弯',
    content: '户外遛弯40分钟，豆豆玩得很开心，和其他狗狗相处融洽。排便两次，状态正常。',
    timestamp: '2026-06-18 10:30:00',
    staffId: 'st002',
    staffName: '王护理',
    medias: [
      { id: 'm2', type: 'image', url: 'https://picsum.photos/id/1025/600/600' },
      { id: 'm3', type: 'image', url: 'https://picsum.photos/id/1062/600/600' }
    ]
  },
  {
    id: 'c003',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    petId: 'p001',
    petName: '豆豆',
    petAvatar: 'https://picsum.photos/id/237/200/200',
    type: 'photo',
    title: '日常照片分享',
    content: '豆豆在房间里休息的日常照片，乖乖地趴在软床上晒太阳，特别惬意~',
    timestamp: '2026-06-18 14:00:00',
    staffId: 'st001',
    staffName: '李护理',
    medias: [
      { id: 'm4', type: 'image', url: 'https://picsum.photos/id/1074/600/600' },
      { id: 'm5', type: 'image', url: 'https://picsum.photos/id/718/600/600' },
      { id: 'm6', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://picsum.photos/id/1084/600/600' },
      { id: 'm6v', type: 'image', url: 'https://picsum.photos/id/1084/600/600' }
    ]
  },
  {
    id: 'c004',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    petId: 'p001',
    petName: '豆豆',
    petAvatar: 'https://picsum.photos/id/237/200/200',
    type: 'cleaning',
    title: '房间清洁消毒',
    content: '完成房间全面清洁消毒，更换干净睡垫，清洗食盆和饮水器，环境整洁舒适。',
    timestamp: '2026-06-18 15:30:00',
    staffId: 'st003',
    staffName: '张护理',
    medias: []
  },
  {
    id: 'c005',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    petId: 'p001',
    petName: '豆豆',
    petAvatar: 'https://picsum.photos/id/237/200/200',
    type: 'walking',
    title: '下午遛弯',
    content: '下午户外遛弯35分钟，豆豆状态很好，跑跳活跃。途中遇到其他狗狗友好互动。',
    timestamp: '2026-06-18 16:45:00',
    staffId: 'st002',
    staffName: '王护理',
    medias: [
      { id: 'm7', type: 'image', url: 'https://picsum.photos/id/1035/600/600' }
    ]
  },
  {
    id: 'c006',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    petId: 'p001',
    petName: '豆豆',
    petAvatar: 'https://picsum.photos/id/237/200/200',
    type: 'abnormal',
    title: '轻微皮肤红疹',
    content: '晚上检查时发现豆豆腹部有轻微红疹，已联系医生进行初步检查。判断可能是轻微过敏，已涂抹外用药膏，正在观察中。已同步主人。',
    timestamp: '2026-06-18 20:00:00',
    staffId: 'st001',
    staffName: '李护理',
    medias: [
      { id: 'm9', type: 'image', url: 'https://picsum.photos/id/237/600/600' },
      { id: 'm10', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://picsum.photos/id/1062/600/600' }
    ],
    abnormalLevel: 'low',
    abnormalDetails: '腹部轻微红疹，无发烧，精神食欲正常',
    handled: true,
    handledAt: '2026-06-18 21:30:00',
    handledBy: '陈医生'
  },
  {
    id: 'c007',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    petId: 'p001',
    petName: '豆豆',
    petAvatar: 'https://picsum.photos/id/237/200/200',
    type: 'feeding',
    title: '晚餐喂食',
    content: '晚餐进食情况良好，全部吃完，饮水正常。红疹情况有所好转，精神状态依然活泼。',
    timestamp: '2026-06-18 18:30:00',
    staffId: 'st001',
    staffName: '李护理',
    medias: [
      { id: 'm8', type: 'image', url: 'https://picsum.photos/id/659/600/600' }
    ]
  },
  {
    id: 'c008',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    petId: 'p001',
    petName: '豆豆',
    petAvatar: 'https://picsum.photos/id/237/200/200',
    type: 'medication',
    title: '外用药物涂抹',
    content: '按照医嘱，晚间再次为豆豆腹部红疹处涂抹外用药膏，配合观察。涂抹时豆豆配合度良好。',
    timestamp: '2026-06-18 22:00:00',
    staffId: 'st001',
    staffName: '李护理',
    medias: []
  }
];

export const careTodos: CareTodo[] = [
  {
    id: 't001',
    orderId: 'o001',
    petId: 'p001',
    petName: '豆豆',
    type: 'feeding',
    title: '早餐喂食',
    scheduledTime: '2026-06-19 08:00:00',
    completed: false
  },
  {
    id: 't002',
    orderId: 'o001',
    petId: 'p001',
    petName: '豆豆',
    type: 'walking',
    title: '上午遛弯',
    scheduledTime: '2026-06-19 10:30:00',
    completed: false
  },
  {
    id: 't003',
    orderId: 'o001',
    petId: 'p001',
    petName: '豆豆',
    type: 'medication',
    title: '红疹药膏涂抹',
    scheduledTime: '2026-06-19 09:00:00',
    completed: false
  },
  {
    id: 't004',
    orderId: 'o001',
    petId: 'p001',
    petName: '豆豆',
    type: 'photo',
    title: '拍照分享给主人',
    scheduledTime: '2026-06-19 14:00:00',
    completed: false
  },
  {
    id: 't005',
    orderId: 'o001',
    petId: 'p001',
    petName: '豆豆',
    type: 'walking',
    title: '下午遛弯',
    scheduledTime: '2026-06-19 16:30:00',
    completed: false
  },
  {
    id: 't006',
    orderId: 'o001',
    petId: 'p001',
    petName: '豆豆',
    type: 'feeding',
    title: '晚餐喂食',
    scheduledTime: '2026-06-19 18:30:00',
    completed: false
  }
];

export const careSummary: CareSummary = {
  date: '2026-06-18',
  feedingCount: 3,
  walkingCount: 3,
  cleaningCount: 2,
  medicationCount: 2,
  photoCount: 8,
  abnormalCount: 1
};

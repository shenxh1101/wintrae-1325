import type { Message, ChatMessage } from '@/types/message';

export const messages: Message[] = [
  {
    id: 'msg001',
    type: 'order',
    title: '订单确认通知',
    content: '您的订单 FY20260618001 已确认，豪华观景房已为豆豆预留成功。入住时间：2026年6月18日10:30，请准时带爱宠入住。',
    summary: '订单确认成功',
    timestamp: '2026-06-15 16:00:00',
    status: 'read',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    receiverId: 'u001',
    action: {
      type: 'navigate',
      label: '查看订单',
      target: '/pages/order-detail/index?id=o001'
    }
  },
  {
    id: 'msg002',
    type: 'reminder',
    title: '入住提醒',
    content: '明天（6月18日）就是豆豆的入住日啦！请记得携带：①疫苗本 ②宠物常用粮食 ③喜欢的玩具/毯子 ④牵引绳。我们已准备好温馨的房间等待豆豆的到来~',
    summary: '明天就是入住日啦',
    timestamp: '2026-06-17 18:00:00',
    status: 'unread',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    receiverId: 'u001'
  },
  {
    id: 'msg003',
    type: 'order',
    title: '成功入住通知',
    content: '豆豆已于今日10:30成功入住豪华观景房A-12，已完成健康检查，状态良好。护理团队将全程悉心照料，请您放心出行！',
    summary: '豆豆已成功入住',
    timestamp: '2026-06-18 10:45:00',
    status: 'unread',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    receiverId: 'u001',
    action: {
      type: 'navigate',
      label: '查看照护',
      target: '/pages/care/index'
    }
  },
  {
    id: 'msg004',
    type: 'chat',
    title: '李护理发来消息',
    content: '您好，豆豆今天状态很好，早餐吃得很香，刚刚完成了上午的遛弯，给您发了几张照片，在照护日志里可以查看哦~',
    summary: '豆豆今天状态很好',
    timestamp: '2026-06-18 11:20:00',
    status: 'unread',
    senderId: 'st001',
    senderName: '李护理',
    senderAvatar: 'https://picsum.photos/id/1005/100/100',
    receiverId: 'u001',
    orderId: 'o001'
  },
  {
    id: 'msg005',
    type: 'reminder',
    title: '异常情况通知',
    content: '【重要】豆豆晚间检查时发现腹部有轻微红疹，已联系医生初步诊断为轻微过敏，已涂抹药膏。目前精神食欲正常，请您放心，我们会持续观察并及时反馈。',
    summary: '豆豆出现轻微红疹，已处理',
    timestamp: '2026-06-18 20:15:00',
    status: 'unread',
    orderId: 'o001',
    orderNo: 'FY20260618001',
    receiverId: 'u001',
    action: {
      type: 'navigate',
      label: '查看详情',
      target: '/pages/log-detail/index?id=c006'
    }
  },
  {
    id: 'msg006',
    type: 'chat',
    title: '王护理发来消息',
    content: '您好！关于红疹的事情请别担心，刚才陈医生来看过了，说确实是小问题，药膏已经涂上了，豆豆现在睡得很香呢。明天再观察一天应该就没事了~',
    summary: '陈医生看过了，问题不大',
    timestamp: '2026-06-18 21:45:00',
    status: 'unread',
    senderId: 'st002',
    senderName: '王护理',
    senderAvatar: 'https://picsum.photos/id/1012/100/100',
    receiverId: 'u001',
    orderId: 'o001'
  },
  {
    id: 'msg007',
    type: 'system',
    title: '订单确认通知',
    content: '您的订单 FY20260620001 已确认，猫咪专属房已为咪咪预留成功。请于6月20日准时入住哦~',
    summary: '咪咪的订单已确认',
    timestamp: '2026-06-17 10:00:00',
    status: 'read',
    orderId: 'o002',
    orderNo: 'FY20260620001',
    receiverId: 'u001'
  },
  {
    id: 'msg008',
    type: 'review',
    title: '邀请您评价服务',
    content: '球球的寄养之旅已圆满结束！感谢您选择萌宠寄养，诚邀您为本次服务评价，您的反馈是我们不断进步的动力。完成评价还可获得20元优惠券哦~',
    summary: '诚邀您评价球球的寄养服务',
    timestamp: '2026-06-11 10:00:00',
    status: 'read',
    orderId: 'o003',
    orderNo: 'FY20260605001',
    receiverId: 'u001',
    action: {
      type: 'navigate',
      label: '去评价',
      target: '/pages/order-detail/index?id=o003'
    }
  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: 'cm001',
    conversationId: 'conv001',
    senderId: 'st001',
    senderName: '李护理',
    senderAvatar: 'https://picsum.photos/id/1005/100/100',
    content: '您好，欢迎咨询萌宠寄养！请问有什么可以帮您的？',
    type: 'text',
    timestamp: '2026-06-18 10:00:00',
    isMe: false
  },
  {
    id: 'cm002',
    conversationId: 'conv001',
    senderId: 'u001',
    senderName: '张小明',
    senderAvatar: 'https://picsum.photos/id/1011/100/100',
    content: '你好，我想了解一下寄养的房型和价格',
    type: 'text',
    timestamp: '2026-06-18 10:05:00',
    isMe: true
  },
  {
    id: 'cm003',
    conversationId: 'conv001',
    senderId: 'st001',
    senderName: '李护理',
    senderAvatar: 'https://picsum.photos/id/1005/100/100',
    content: '好的！我们有多种房型可选：舒适标准间88元/晚、豪华观景房198元/晚、VIP套房288元/晚，还有猫咪专属房和大型犬房间哦~ 您是寄养狗狗还是猫咪呢？',
    type: 'text',
    timestamp: '2026-06-18 10:06:00',
    isMe: false
  },
  {
    id: 'cm004',
    conversationId: 'conv001',
    senderId: 'u001',
    senderName: '张小明',
    senderAvatar: 'https://picsum.photos/id/1011/100/100',
    content: '我家是金毛，3岁了，推荐哪个房型呢？',
    type: 'text',
    timestamp: '2026-06-18 10:10:00',
    isMe: true
  },
  {
    id: 'cm005',
    conversationId: 'conv001',
    senderId: 'st001',
    senderName: '李护理',
    senderAvatar: 'https://picsum.photos/id/1005/100/100',
    content: '金毛推荐豪华观景房哦，空间宽敞还有落地窗，每天遛弯3次。现在预订还送基础洗护一次~',
    type: 'text',
    timestamp: '2026-06-18 10:12:00',
    isMe: false
  }
];

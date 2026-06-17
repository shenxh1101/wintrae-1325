export type MessageType = 'system' | 'order' | 'reminder' | 'review' | 'chat';
export type MessageStatus = 'unread' | 'read';

export interface Message {
  id: string;
  type: MessageType;
  title: string;
  content: string;
  summary?: string;
  timestamp: string;
  status: MessageStatus;
  orderId?: string;
  orderNo?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  receiverId: string;
  action?: {
    type: 'navigate' | 'call' | 'confirm';
    label: string;
    target?: string;
  };
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'system';
  timestamp: string;
  isMe: boolean;
}

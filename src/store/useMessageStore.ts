import { create } from 'zustand';
import type { Message } from '@/types/message';
import { messages as mockMessages } from '@/data/messages';
import dayjs from 'dayjs';

interface MessageState {
  messages: Message[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markBatchAsRead: (ids: string[]) => void;
  deleteMessage: (id: string) => void;
  deleteBatch: (ids: string[]) => void;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'status'> & { status?: 'unread' | 'read' }) => void;
  getUnreadCount: () => number;
  getUnreadByType: (type: string) => number;
}

let msgIdCounter = 100;

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: mockMessages,

  markAsRead: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, status: 'read' as const } : m
      )
    })),

  markAllAsRead: () =>
    set((state) => ({
      messages: state.messages.map((m) => ({ ...m, status: 'read' as const }))
    })),

  markBatchAsRead: (ids) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        ids.includes(m.id) ? { ...m, status: 'read' as const } : m
      )
    })),

  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id)
    })),

  deleteBatch: (ids) =>
    set((state) => ({
      messages: state.messages.filter((m) => !ids.includes(m.id))
    })),

  addMessage: (msg) => {
    msgIdCounter++;
    const newMsg: Message = {
      id: `msg${msgIdCounter}`,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      status: 'unread',
      ...msg
    } as Message;
    set((state) => ({
      messages: [newMsg, ...state.messages]
    }));
  },

  getUnreadCount: () => get().messages.filter((m) => m.status === 'unread').length,

  getUnreadByType: (type) =>
    get().messages.filter((m) => m.type === type && m.status === 'unread').length
}));

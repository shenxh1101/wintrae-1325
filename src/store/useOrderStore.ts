import { create } from 'zustand';
import type { Order, AddonService, FeeDetail } from '@/types/order';
import { orders as mockOrders, addonServices } from '@/data/orders';
import { rooms } from '@/data/rooms';
import { usePetStore } from './usePetStore';
import { useMessageStore } from './useMessageStore';
import dayjs from 'dayjs';

interface OrderState {
  orders: Order[];
  addonServices: AddonService[];
  selectedRoomId: string | null;
  checkinDate: string;
  checkoutDate: string;
  selectedPetIds: string[];
  selectedAddonIds: string[];
  specialNotes: string;
  setSelectedRoom: (id: string | null) => void;
  setDates: (checkin: string, checkout: string) => void;
  togglePet: (petId: string) => void;
  toggleAddon: (addonId: string) => void;
  setSpecialNotes: (notes: string) => void;
  getSelectedRoom: () => typeof rooms[0] | undefined;
  getSelectedPets: () => ReturnType<typeof usePetStore.getState.pets.filter>;
  getSelectedAddons: () => AddonService[];
  calculateTotal: () => number;
  calculateNights: () => number;
  resetBooking: () => void;
  getOrderById: (id: string) => Order | undefined;
  updateOrderDates: (orderId: string, checkin: string, checkout: string) => void;
  updateOrderAddons: (orderId: string, addonIds: string[]) => void;
  applyCancelOrder: (orderId: string, reason?: string) => void;
  contactStoreFromOrder: (orderId: string, content: string) => void;
  getActiveOrders: () => Order[];
}

const today = new Date();
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const calculateFeeDetails = (
  room: typeof rooms[0],
  nights: number,
  addons: AddonService[],
  petCount: number
): FeeDetail[] => {
  const details: FeeDetail[] = [];
  details.push({
    id: 'room',
    name: `${room.name} 房费`,
    amount: room.price * nights,
    quantity: nights,
    unit: '晚'
  });
  if (petCount > 1) {
    details.push({
      id: 'extraPet',
      name: '多宠物附加费',
      amount: (petCount - 1) * 30 * nights,
      quantity: petCount - 1,
      unit: '只'
    });
  }
  addons.forEach((addon) => {
    details.push({
      id: addon.id,
      name: addon.name,
      amount: addon.price
    });
  });
  return details;
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: mockOrders,
  addonServices,
  selectedRoomId: null,
  checkinDate: formatDate(tomorrow),
  checkoutDate: formatDate(nextWeek),
  selectedPetIds: [],
  selectedAddonIds: [],
  specialNotes: '',

  setSelectedRoom: (id) => set({ selectedRoomId: id }),
  setDates: (checkin, checkout) => set({ checkinDate: checkin, checkoutDate: checkout }),
  togglePet: (petId) =>
    set((state) => ({
      selectedPetIds: state.selectedPetIds.includes(petId)
        ? state.selectedPetIds.filter((id) => id !== petId)
        : [...state.selectedPetIds, petId]
    })),
  toggleAddon: (addonId) =>
    set((state) => ({
      selectedAddonIds: state.selectedAddonIds.includes(addonId)
        ? state.selectedAddonIds.filter((id) => id !== addonId)
        : [...state.selectedAddonIds, addonId]
    })),
  setSpecialNotes: (notes) => set({ specialNotes: notes }),

  getSelectedRoom: () => rooms.find((r) => r.id === get().selectedRoomId),
  getSelectedPets: () => {
    const petState = usePetStore.getState();
    return petState.pets.filter((p) => get().selectedPetIds.includes(p.id));
  },
  getSelectedAddons: () => addonServices.filter((s) => get().selectedAddonIds.includes(s.id)),

  calculateNights: () => {
    const { checkinDate, checkoutDate } = get();
    const start = new Date(checkinDate).getTime();
    const end = new Date(checkoutDate).getTime();
    const nights = Math.ceil((end - start) / (24 * 60 * 60 * 1000));
    return Math.max(nights, 1);
  },

  calculateTotal: () => {
    const room = get().getSelectedRoom();
    const nights = get().calculateNights();
    const addons = get().getSelectedAddons();
    const roomPrice = room ? room.price * nights : 0;
    const addonPrice = addons.reduce((sum, a) => sum + a.price, 0);
    const selectedPetsCount = get().selectedPetIds.length;
    const extraPetFee = selectedPetsCount > 1 ? (selectedPetsCount - 1) * 30 * nights : 0;
    return roomPrice + addonPrice + extraPetFee;
  },

  resetBooking: () =>
    set({
      selectedRoomId: null,
      selectedPetIds: [],
      selectedAddonIds: [],
      specialNotes: ''
    }),

  getOrderById: (id) => get().orders.find((o) => o.id === id),

  getActiveOrders: () =>
    get().orders.filter((o) =>
      ['pending', 'confirmed', 'checkin', 'care', 'checkout'].includes(o.status)
    ),

  updateOrderDates: (orderId, checkin, checkout) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order || !order.room) return;

    const nights = Math.max(
      Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / (24 * 60 * 60 * 1000)),
      1
    );
    const petCount = order.pets?.length || 0;
    const addons = order.addonServices || [];
    const feeDetails = calculateFeeDetails(order.room, nights, addons, petCount);
    const totalAmount = feeDetails.reduce((sum, f) => sum + f.amount, 0);
    const depositAmount = order.room.price * 0.5;

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              checkinDate: checkin,
              checkoutDate: checkout,
              nights,
              totalAmount,
              depositAmount,
              feeDetails
            }
          : o
      )
    }));

    useMessageStore.getState().addMessage({
      type: 'order',
      title: '订单改期成功',
      content: `您的订单 ${order.orderNo} 已改期，入住时间：${dayjs(checkin).format('MM月DD日')} 至 ${dayjs(checkout).format('MM月DD日')}，共 ${nights} 晚。`,
      summary: '订单改期成功',
      receiverId: 'u001',
      orderId,
      orderNo: order.orderNo,
      action: {
        type: 'navigate',
        label: '查看订单',
        target: `/pages/order-detail/index?id=${orderId}`
      }
    });
  },

  updateOrderAddons: (orderId, addonIds) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order || !order.room) return;

    const addons = addonServices.filter((a) => addonIds.includes(a.id));
    const petCount = order.pets?.length || 0;
    const feeDetails = calculateFeeDetails(order.room, order.nights, addons, petCount);
    const totalAmount = feeDetails.reduce((sum, f) => sum + f.amount, 0);

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              addonServices: addons,
              totalAmount,
              feeDetails
            }
          : o
      )
    }));

    useMessageStore.getState().addMessage({
      type: 'order',
      title: '附加服务已更新',
      content: `您的订单 ${order.orderNo} 附加服务已更新，当前共选择 ${addons.length} 项服务。`,
      summary: '附加服务已更新',
      receiverId: 'u001',
      orderId,
      orderNo: order.orderNo,
      action: {
        type: 'navigate',
        label: '查看订单',
        target: `/pages/order-detail/index?id=${orderId}`
      }
    });
  },

  applyCancelOrder: (orderId, reason) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
      )
    }));

    useMessageStore.getState().addMessage({
      type: 'system',
      title: '订单已取消',
      content: `您的订单 ${order.orderNo} 已取消${reason ? `，取消原因：${reason}` : ''}。押金将在1-3个工作日内原路退回。`,
      summary: '订单已取消',
      receiverId: 'u001',
      orderId,
      orderNo: order.orderNo
    });
  },

  contactStoreFromOrder: (orderId, content) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;

    useMessageStore.getState().addMessage({
      type: 'chat',
      title: '门店客服已回复',
      content: '您好，您的留言我们已收到，会尽快为您处理，请稍候~',
      summary: '客服已收到您的留言',
      receiverId: 'u001',
      senderId: 'st000',
      senderName: '门店客服',
      senderAvatar: 'https://picsum.photos/id/1005/100/100',
      orderId
    });
  }
}));

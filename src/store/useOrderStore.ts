import { create } from 'zustand';
import type { Order, AddonService } from '@/types/order';
import { orders as mockOrders, addonServices } from '@/data/orders';
import { rooms } from '@/data/rooms';
import { pets } from '@/data/pets';

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
  getSelectedPets: () => typeof pets;
  getSelectedAddons: () => AddonService[];
  calculateTotal: () => number;
  calculateNights: () => number;
  resetBooking: () => void;
  getOrderById: (id: string) => Order | undefined;
}

const today = new Date();
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

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
  getSelectedPets: () => pets.filter((p) => get().selectedPetIds.includes(p.id)),
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

  getOrderById: (id) => get().orders.find((o) => o.id === id)
}));

import { create } from 'zustand';
import type { Pet } from '@/types/pet';
import { pets as mockPets } from '@/data/pets';

interface PetState {
  pets: Pet[];
  selectedPetId: string | null;
  addPet: (pet: Pet) => void;
  updatePet: (id: string, data: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  selectPet: (id: string | null) => void;
  getPetById: (id: string) => Pet | undefined;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: mockPets,
  selectedPetId: null,
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
  updatePet: (id, data) =>
    set((state) => ({
      pets: state.pets.map((p) => (p.id === id ? { ...p, ...data } : p))
    })),
  deletePet: (id) =>
    set((state) => ({ pets: state.pets.filter((p) => p.id !== id) })),
  selectPet: (id) => set({ selectedPetId: id }),
  getPetById: (id) => get().pets.find((p) => p.id === id)
}));

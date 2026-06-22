import { create } from "zustand";

interface CoverStore {
    coverPosition: DOMRect | null;
    setCoverPosition: (position: DOMRect | null) => void;
}

const useCoverStore = create<CoverStore>((set) => ({
    coverPosition: null,
    setCoverPosition: (position) => set({ coverPosition: position }),
}))

export default useCoverStore;
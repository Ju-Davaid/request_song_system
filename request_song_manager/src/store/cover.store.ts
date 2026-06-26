import { create } from "zustand";

interface CoverStore {
    coverPosition: DOMRect | null;
    setCoverPosition: (position: DOMRect | null) => void;
}

/**
 * 封面位置状态管理
 * @returns 封面位置状态管理
 * */
const useCoverStore = create<CoverStore>((set) => ({
    coverPosition: null,
    setCoverPosition: (position) => set({ coverPosition: position }),
}))

export default useCoverStore;
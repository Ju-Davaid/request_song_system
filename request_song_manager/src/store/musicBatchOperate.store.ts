import { create } from 'zustand'

interface MusicBatchOperateState {
    isBatchOperation: boolean
    checkedList: string[]
    isBatchDownloading: boolean
    isBatchDeleting: boolean
    setIsBatchDownloading: (isBatchDownloading: boolean) => void
    setIsBatchDeleting: (isBatchDeleting: boolean) => void
    setCheckedList: (checkedList: string[]) => void
    toggleBatchOperation: () => void
    clearCheckedList: () => void
    toggleCheckItem: (item: string) => void
}

/**
 * 音乐批量操作状态管理
 * @returns 音乐批量操作状态管理
 * */
const useMusicBatchOperateStore = create<MusicBatchOperateState>((set) => ({
    isBatchOperation: false,
    isBatchDownloading: false,
    checkedList: [],
    isBatchDeleting: false,
    setIsBatchDownloading: (isBatchDownloading) => set({ isBatchDownloading }),
    setIsBatchDeleting: (isBatchDeleting) => set({ isBatchDeleting }),
    toggleBatchOperation: () => set((state) => ({
        isBatchOperation: !state.isBatchOperation,
        checkedList: [],
    })),
    setCheckedList: (checkedList) => set({ checkedList }),
    clearCheckedList: () => set({ checkedList: [] }),
    toggleCheckItem: (item) => set((state) => ({
        checkedList: state.checkedList.includes(item)
            ? state.checkedList.filter((i) => i !== item)
            : [...state.checkedList, item],
    })),
}))

export default useMusicBatchOperateStore
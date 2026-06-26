import { create } from "zustand"


interface UserInfoStore {
    userInfo: {
        username: string
        avatar: string
        cookie?: string
        uin?: string
    } | null
    setUserInfo: (userInfo: UserInfoStore["userInfo"]) => void
}

/**
 * 用户信息状态管理
 * @returns 用户信息状态管理
 * */
export const useUserInfoStore = create<UserInfoStore>((set) => ({
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo") || "{}") : null,
    setUserInfo: (userInfo) => set({ userInfo }),
}))

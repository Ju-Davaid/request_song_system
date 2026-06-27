import type { QQUserInfoVo } from "@/types/User";
import { Server } from "./server";
import type { QRCodeVO, CheckQrCodeStatusDTO, CheckQrCodeStatusVO } from "@/types/QRCode";
import type { MusicVo } from "@/types/Music";

// 获取登录二维码 - axios.d.ts 已声明返回 BaseVo<QRCodeVO>
export const getLoginQrCode = () => Server.get<QRCodeVO>("/getQQLoginQr");
// 检查登录二维码状态
export const checkQrCodeStatus = (checkQrCodeStatusDto: CheckQrCodeStatusDTO) =>
    Server.post<CheckQrCodeStatusVO>("/checkQQLoginQr", checkQrCodeStatusDto);
// 获取用户信息
export const getUserInfo = (qq: string) => Server.get<QQUserInfoVo>(`/userInfo?qq=${qq}`);
export const getMusicInfo = (keyword: string) => Server.get(`/getMusicInfo?keyword=${keyword}`);
export const getSearchResult = (keyword: string) => Server.get(`/search?keyword=${keyword}`);
export const getMusicPlayUrl = (songmid: string) => Server.get(`/getMusicUrl?songmid=${songmid}`);
// 添加音乐到数据库
export const addMusicToDB = (music: MusicVo) => Server.post("/addMusic", { music });
// 清空数据库中的音乐
export const clearMusicFromDB = () => Server.post("/clearMusic");
// 删除数据库中的音乐
export const deleteMusicFromDB = (songmid: string) => Server.get(`/deleteMusic?songmid=${songmid}`);
export const getMusicListFromDB = () => Server.get<MusicVo[]>("/getMusicList");
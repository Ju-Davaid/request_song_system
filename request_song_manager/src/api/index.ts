import axios from "axios";
import { Server, MusicServer } from "./server";
import type { QRCodeVO, CheckQrCodeStatusDTO, CheckQrCodeStatusVO } from "@/types/QRCode";

// 获取登录二维码
export const getLoginQrCode = () => MusicServer.get<QRCodeVO>("/getQQLoginQr");
// 检查登录二维码状态
export const checkQrCodeStatus = (checkQrCodeStatusDto: CheckQrCodeStatusDTO) =>
    MusicServer.post<CheckQrCodeStatusVO>("/checkQQLoginQr", checkQrCodeStatusDto);
export const getUserInfo = (qq: string) => axios.get(`https://uapis.cn/api/v1/social/qq/userinfo?qq=${qq}`)

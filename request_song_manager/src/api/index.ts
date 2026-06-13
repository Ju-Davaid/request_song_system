import type { QQUserInfoVo } from "@/types/User";
import { Server } from "./server";
import type { QRCodeVO, CheckQrCodeStatusDTO, CheckQrCodeStatusVO } from "@/types/QRCode";

// 获取登录二维码 - axios.d.ts 已声明返回 BaseVo<QRCodeVO>
export const getLoginQrCode = () => Server.get<QRCodeVO>("/getQQLoginQr");
// 检查登录二维码状态
export const checkQrCodeStatus = (checkQrCodeStatusDto: CheckQrCodeStatusDTO) =>
    Server.post<CheckQrCodeStatusVO>("/checkQQLoginQr", checkQrCodeStatusDto);
// 获取用户信息
export const getUserInfo = (qq: string) => Server.get<QQUserInfoVo>(`/userInfo?qq=${qq}`);

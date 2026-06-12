import { Server, MusicServer } from "./server";
import type { QRCodeVO, CheckQrCodeStatusDTO, CheckQrCodeStatusVO } from "@/types/QRCode";

// 获取登录二维码
export const getLoginQrCode = () => MusicServer.get<QRCodeVO>("/getQQLoginQr");
// 检查登录二维码状态
export const checkQrCodeStatus = (checkQrCodeStatusDto: CheckQrCodeStatusDTO) =>
    MusicServer.post<CheckQrCodeStatusVO>("/checkQQLoginQr", checkQrCodeStatusDto);

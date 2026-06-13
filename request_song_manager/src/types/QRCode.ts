// 登录二维码状态
export type QRCodeStatus = "loading" | "expired" | "failed" | "scanned" | "active";
// 登录二维码VO
export interface QRCodeVO {
    img: string;
    ptqrtoken: number;
    qrsig: string;
}
// 检查登录二维码状态DTO
export interface CheckQrCodeStatusDTO {
    ptqrtoken: QRCodeVO["ptqrtoken"];
    qrsig: QRCodeVO["qrsig"];
}

export interface CheckQrCodeStatusVO {
    isOk: boolean;
    refresh: boolean;
    message: string;
    session?: {
        cookie: string;
        cookieList: string[];
        cookieObject: Record<string, string>;
        loginUin: string;
        uin: string;
    }
    error?: string;
}



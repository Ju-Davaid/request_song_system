import { checkQrCodeStatus, getLoginQrCode } from "@/api";
import QRCode from "@/components/QRCode";
import type { QRCodeVO, QRCodeStatus } from "@/types/QRCode";
import { useCallback, useEffect, useRef, useState } from "react";
import qrCodeImage from "@/assets/images/qrCode.png";

const LoginPage = () => {
  const [qrCode, setQrCode] = useState<QRCodeVO | null>(null);
  const qrCodeRef = useRef(qrCode);
  const [qrCodeStatus, setQrCodeStatus] = useState<QRCodeStatus>("loading");
  const inquiryTimer = useRef<number | null>(null);
  // 轮询验证登录状态
  const validateQrCode = useCallback(async () => {
    const current = qrCodeRef.current;
    if (!current?.ptqrtoken) return;
    const res = await checkQrCodeStatus({
      ptqrtoken: current.ptqrtoken,
      qrsig: current.qrsig,
    });
    const qrCodeNewStatus = res.data;
    console.log(qrCodeNewStatus);
    if (qrCodeNewStatus.isOk) {
      setQrCodeStatus("scanned");
      clearInterval(inquiryTimer.current);
      inquiryTimer.current = null;
    } else if (qrCodeNewStatus.refresh) {
      setQrCodeStatus("expired");
      clearInterval(inquiryTimer.current);
      inquiryTimer.current = null;
    }
  }, []);
  // 刷新二维码
  const reloadQrCode = useCallback(async () => {
    try {
      const res = await getLoginQrCode();
      setQrCode(res.data);
      setQrCodeStatus("active");
    } catch (error) {
      console.log("刷新二维码失败:", error);
      setQrCodeStatus("failed");
    }
  }, [setQrCodeStatus]);
  // 监听二维码状态变化
  useEffect(() => {
    qrCodeRef.current = qrCode;
  }, [qrCode]);
  // 初始化加载二维码
  useEffect(() => {
    reloadQrCode();
  }, [reloadQrCode]);
  // 监听状态变化启动/停止轮询
  useEffect(() => {
    if (qrCodeStatus === "active" && !inquiryTimer.current) {
      inquiryTimer.current = setInterval(validateQrCode, 2000);
    }
    return () => {
      if (inquiryTimer.current) {
        clearInterval(inquiryTimer.current);
        inquiryTimer.current = null;
      }
    };
  }, [qrCodeStatus, validateQrCode]);
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="w-96 h-96 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">请使用QQ二维码登录</div>
        <div className="text-lg mb-3">扫描QQ二维码即可登录</div>
        <QRCode
          src={qrCode?.img ?? qrCodeImage}
          size={180}
          status={qrCodeStatus}
        />
      </div>
    </div>
  );
};

export default LoginPage;

import { checkQrCodeStatus, getLoginQrCode, getUserInfo } from "@/api";
import QRCode from "@/components/QRCode";
import type { QRCodeVO, QRCodeStatus } from "@/types/QRCode";
import { useCallback, useEffect, useRef, useState } from "react";
import useMessage from "@/hooks/useMessage";
import { useNavigate } from "react-router-dom";
import { useUserInfoStore } from "@/store/userInfo.store";

const LoginPage = () => {
  const [qrCode, setQrCode] = useState<QRCodeVO | null>(null);
  const qrCodeRef = useRef(qrCode);
  const [qrCodeStatus, setQrCodeStatus] = useState<QRCodeStatus>("loading");
  const inquiryTimer = useRef<number | null>(null);
  const { success, error, contextHolder } = useMessage();
  const navigate = useNavigate();
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  // 轮询验证登录状态
  const validateQrCode = useCallback(async () => {
    const current = qrCodeRef.current;
    if (!current?.ptqrtoken) return;
    try {
      const res = await checkQrCodeStatus({
        ptqrtoken: current.ptqrtoken,
        qrsig: current.qrsig,
      });
      const checkRes = res.data;
      console.log("checkRes:", checkRes);
      if (checkRes.isOk) {
        setQrCodeStatus("scanned");
        success("登录成功");
        clearInterval(inquiryTimer.current);
        inquiryTimer.current = null;
        const { data: userInfo } = await getUserInfo(checkRes.session.loginUin);
        const newInfo = {
          username: userInfo.nickname,
          avatar: userInfo.avatar_url,
          cookie: checkRes.session.cookie,
        };
        console.log("登录成功:", newInfo);
        localStorage.setItem("userInfo", JSON.stringify(newInfo));
        setUserInfo(newInfo);
        setTimeout(() => {
          navigate("/music", { replace: true });
        }, 1000);
      } else if (checkRes.refresh) {
        setQrCodeStatus("expired");
        clearInterval(inquiryTimer.current);
        inquiryTimer.current = null;
      }
    } catch (err) {
      console.log("检查登录二维码状态失败:", err);
      error("登录失败，请重新扫描二维码");
      setQrCodeStatus("failed");
      clearInterval(inquiryTimer.current);
      inquiryTimer.current = null;
    }
  }, []);
  // 刷新二维码
  const reloadQrCode = useCallback(async () => {
    try {
      setQrCodeStatus("loading");
      const res = await getLoginQrCode();
      console.log(res);
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
      inquiryTimer.current = setInterval(validateQrCode, 1500);
    }
    return () => {
      if (inquiryTimer.current) {
        clearInterval(inquiryTimer.current);
        inquiryTimer.current = null;
      }
    };
  }, [qrCodeStatus, validateQrCode]);
  return (
    <>
      {contextHolder}
      <div className="w-screen h-screen flex justify-center items-center bg-white">
        <div className="w-96 h-96 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">请使用QQ二维码登录</div>
          <div className="text-lg mb-3">扫描QQ二维码即可登录</div>
          <QRCode
            src={qrCode?.img}
            size={180}
            status={qrCodeStatus}
            onReload={reloadQrCode}
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;

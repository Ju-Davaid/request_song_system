import { memo } from "react";
import type { QRCodeStatus } from "@/types/QRCode";
import { AiFillExclamationCircle } from "react-icons/ai";
import { AiOutlineReload, AiFillCheckCircle } from "react-icons/ai";
import { Spin } from "antd";

interface QRCodeProps {
  src: string;
  size: number;
  status?: QRCodeStatus;
  onReload?: () => void;
}
const QRCode = memo<QRCodeProps>(
  ({ src, size, status = "active", onReload }) => {
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className="relative p-1 border border-gray-300 rounded-md overflow-hidden"
      >
        {status !== "active" && (
          <div className="absolute z-10 left-0 top-0 w-full h-full flex items-center justify-center flex-col gap-2 bg-[rgba(20,20,20,0.96)]">
            {/* 验证码过期或加载失败状态 */}
            {(status === "expired" || status === "failed") && (
              <>
                <div className="flex gap-1 items-center">
                  <AiFillExclamationCircle className="text-2x" color="red" />
                  <div className="text-white text-sm">
                    {status === "expired" ? "已过期" : "加载失败"}
                  </div>
                </div>
                <div
                  className={`flex gap-1 items-center cursor-pointer ${status === "failed" ? "text-red-500  hover:text-red-600" : "text-blue-500 hover:text-blue-600"}`}
                  onClick={() => onReload?.()}
                >
                  <AiOutlineReload className="text-2x" />
                  <div className="text-2x">点击刷新</div>
                </div>
              </>
            )}
            {/* 验证码已扫描状态 */}
            {status === "scanned" && (
              <>
                <div className="flex gap-1 items-center">
                  <AiFillCheckCircle className="text-2x" color="green" />
                  <div className="text-white text-sm">已扫描</div>
                </div>
              </>
            )}
            {/* 验证码加载中状态 */}
            {status === "loading" && <Spin />}
          </div>
        )}

        <img src={src} alt="" className="w-full h-full" />
      </div>
    );
  },
);

export default QRCode;

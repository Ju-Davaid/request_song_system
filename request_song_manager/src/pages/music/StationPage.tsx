import stationBg from "@/assets/images/station_bg.webp";
import { useUserInfoStore } from "@/store/userInfo.store";
import {
  AiFillSetting,
  AiFillStepBackward,
  AiFillStepForward,
} from "react-icons/ai";
import { FaPlay } from "react-icons/fa";
import StationConfigModal from "@/components/StationConfigModal";
import type { StationConfigModalExpose } from "@/components/StationConfigModal";
import qqLogin from "@/assets/images/login_qq.png";
import { useRef } from "react";

const StationPage = () => {
  const stationConfigModalRef = useRef<StationConfigModalExpose>(null);
  const { avatar, username } = useUserInfoStore((state) => state.userInfo);
  return (
    <>
      <StationConfigModal ref={stationConfigModalRef} />
      {/* 背景层 */}
      <div className="relative w-screen min-h-screen bg-[#292a2b]">
        {/* 背景层 */}
        <div
          style={{
            backgroundImage: `url(${stationBg})`,
          }}
          className="z-1 w-full h-full fixed left-0 top-0 bg-no-repeat bg-cover bg-center blur-[65px] opacity-60 bg-white"
        ></div>
        {/* 遮罩层 */}
        <div className="z-2 w-full h-full fixed left-0 top-0 bg-[rgba(0,0,0,0.35)]"></div>
        {/* 内容层 */}
        <main className="z-3 w-full h-full fixed left-0 top-0 flex flex-col">
          {/* 头部容器 */}
          <header className="flex p-5 justify-between items-center text-white">
            {/* 标题 */}
            <div className="text-2xl font-[HuaWenFont] opacity-50">
              老友会点歌台
            </div>
            {/* 用户信息和配置容器 */}
            <div className="flex gap-4 items-center">
              {/* 用户信息 */}
              <div className="flex gap-2 items-center">
                <div className="size-7.5 relative">
                  <img
                    src={avatar}
                    alt="用户头像"
                    className="absolute left-0 top-0 w-full h-full object-cover rounded-full "
                  />
                  <img
                    className="absolute right-0 bottom-0 z-1 size-3"
                    src={qqLogin}
                    alt=""
                  />
                </div>
                <div className="text-[14px] opacity-50">{username}</div>
              </div>
              {/* 设置 */}
              <AiFillSetting
                onClick={() => stationConfigModalRef.current?.show()}
                className="cursor-pointer text-2xl opacity-50 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </header>
          {/* 内容容器 */}
          <div className="flex-1">
            <div className=""></div>
          </div>
          {/* 底部音乐播放器械 */}
          <div className="mx-[6%] pb-10 flex">
            <div className="flex gap-10 items-center">
              <AiFillStepBackward
                size={35}
                className="text-white cursor-pointer text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <FaPlay
                size={30}
                className="text-white cursor-pointer text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <AiFillStepForward
                size={35}
                className="text-white cursor-pointer text-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default StationPage;

import stationBg from "@/assets/images/station_bg_2.webp";
import { useUserInfoStore } from "@/store/userInfo.store";
import { AiFillSetting } from "react-icons/ai";
import StationConfigModal from "@/components/StationConfigModal";
import type { StationConfigModalExpose } from "@/components/StationConfigModal";
import qqLogin from "@/assets/images/login_qq.png";
import { useEffect, useRef, useState } from "react";
import MusicControlBar from "@/components/MusicControlBar";
import musicList from "@/data/musicMockData";
import usePlayerStore from "@/store/player.store";

/** 点歌台页面 */
const StationPage = () => {
  // 设置弹窗引用
  const stationConfigModalRef = useRef<StationConfigModalExpose>(null);
  // 用户信息
  const { avatar, username } = useUserInfoStore((state) => state.userInfo);
  const musicPlayerRef = useRef<HTMLAudioElement>(null);
  const [currentMusic, setCurrentMusic] = useState(musicList[0]);
  const changeMusic = usePlayerStore((state) => state.changeMusic);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  useEffect(() => {
    setPlayer(musicPlayerRef.current!);
  }, [setPlayer]);
  useEffect(() => {
    changeMusic(currentMusic.url);
  }, [changeMusic, currentMusic]);

  return (
    <>
      <audio className="hidden" ref={musicPlayerRef}></audio>
      {/* 设置弹窗 */}
      <StationConfigModal ref={stationConfigModalRef} />
      <div className="relative w-screen min-h-screen bg-[#7c756d]">
        {/* 背景层 */}
        <div
          style={{
            backgroundImage: `url(${currentMusic.cover})`,
          }}
          className="translate-z-0 w-full h-full fixed left-0 top-0 bg-no-repeat bg-cover bg-position-[50%] blur-[65px] opacity-60 bg-white"
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
          {/* 底部音乐播放器 */}
          <MusicControlBar />
        </main>
      </div>
    </>
  );
};
export default StationPage;

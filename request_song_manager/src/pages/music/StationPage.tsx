import { useUserInfoStore } from "@/store/userInfo.store";
import { AiFillSetting } from "react-icons/ai";
import MyModal from "@/components/MyModal";
import type { MyModalExpose } from "@/components/MyModal";
import qqLogin from "@/assets/images/login_qq.png";
import { useCallback, useEffect, useRef, useState } from "react";
import MusicController from "@/components/MusicController";
import usePlayerStore from "@/store/player.store";
import { notification } from "antd";
import type { MusicVo } from "@/types/Music";
import LoadingPage from "@/components/LoadingPage";
import BlurBackground from "@/components/BlurBackground";
import defaultCover from "@/assets/images/default_cover.jpg";
import Search from "@/components/Search";
import PureMode from "@/pages/music/PureMode";
import MusicCover from "@/components/MusicCover";
import useCoverStore from "@/store/cover.store";
import NormalMode from "@/pages/music/NormalMode";
import { AnimatePresence, motion } from "motion/react";
import musicList from "@/data/musicMockData";

/** 点歌台页面 */
const StationPage = () => {
  // 当前封面位置
  const coverPosition = useCoverStore((state) => state.coverPosition);
  // 设置弹窗引用
  const myModalRef = useRef<MyModalExpose>(null);
  // 用户信息
  const { avatar, username } = useUserInfoStore((state) => state.userInfo);
  // 音乐播放器引用
  const musicPlayerRef = useRef<HTMLAudioElement>(new Audio());
  // 通知组件引用
  const [NotificationApi, NotificationContextHolder] =
    notification.useNotification();
  // 设置音乐播放器
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const isCleanMode = usePlayerStore((state) => state.isCleanMode);
  // 设置音乐列表
  const setMusicList = usePlayerStore((state) => state.setMusicList);
  // 当前播放音乐
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  // 添加音乐
  // const addMusic = usePlayerStore((state) => state.addMusic);
  // 是否正在播放
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  // 加载状态
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // 音乐播放结束处理
  const handelMusicEnd = useCallback(() => {
    NotificationApi.info({
      title: `播放结束`,
      duration: false,
      description: "当前播放列表已经播放完毕",
      placement: "topRight",
    });
  }, []);
  // 音乐播放错误处理
  const handelMusicError = useCallback((music?: MusicVo) => {
    if (!music) return;
    NotificationApi.error({
      title: `《${music?.name}》播放失败`,
      duration: false,
      description: "请检查网络连接或联系管理员",
      placement: "topRight",
    });
  }, []);
  // 设置音乐播放器实例
  useEffect(() => {
    setPlayer({
      player: musicPlayerRef.current!,
      onError: handelMusicError,
      onEnded: handelMusicEnd,
    });
  }, [setPlayer]);
  // 初始切换音乐
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, [isLoaded]);
  return (
    <>
      <LoadingPage isVisible={!isLoaded} />
      {NotificationContextHolder}
      {/* 设置弹窗 */}
      <MyModal ref={myModalRef} title="设置" />
      <div className="relative w-screen h-screen bg-[#7c756d] overflow-hidden">
        {/* 音乐封面 */}
        {coverPosition && (
          <MusicCover
            className={`${isCleanMode && "animate-rotate-360"} ${isCleanMode && !isPlaying && "animate-pause"}`}
            src={currentMusic?.cover ?? defaultCover}
            width={200}
            height={200}
            position={coverPosition}
            isRounded={isCleanMode}
          />
        )}
        {/* 背景层 */}
        <BlurBackground imageSrc={currentMusic?.cover} />
        {/* 内容层 */}
        <main className="z-3 w-full h-full fixed left-0 top-0 flex flex-col">
          {/* 头部容器 */}
          <header className="flex p-5 h-18 justify-between items-center text-white">
            {/* 头部队容器左侧部分 */}
            <div className="flex items-center">
              <div className="text-2xl font-[HuaWenFont] opacity-50 mr-10">
                老友会点歌台
              </div>
              <Search />
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
                onClick={() => myModalRef.current?.show()}
                className="cursor-pointer text-2xl opacity-50 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </header>
          {/* 内容容器 */}
          <AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                className="flex-1 flex pt-2"
                key={isCleanMode ? "pure" : "normal"}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {!isCleanMode ? <NormalMode /> : <PureMode />}
              </motion.div>
            </AnimatePresence>
          </AnimatePresence>
          {/* 底部音乐播放器 */}
          <MusicController />
        </main>
      </div>
    </>
  );
};

export default StationPage;

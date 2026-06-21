import { useUserInfoStore } from "@/store/userInfo.store";
import { AiFillSetting, AiOutlineClear, AiOutlineSearch } from "react-icons/ai";
import { FaListUl } from "react-icons/fa";
import MyModal from "@/components/MyModal";
import type { MyModalExpose } from "@/components/MyModal";
import qqLogin from "@/assets/images/login_qq.png";
import { useCallback, useEffect, useRef, useState } from "react";
import MusicController from "@/components/MusicController";
import usePlayerStore from "@/store/player.store";
import { notification } from "antd";
// import { getMusicInfo } from "@/api";
import type { MusicVo } from "@/types/Music";
import MusicList from "@/components/MusicList";
import LoadingPage from "@/components/LoadingPage";
import { Image, Popconfirm } from "antd";
import BlurBackground from "@/components/BlurBackground";
import defaultCover from "@/assets/images/default_cover.jpg";
import musicList from "@/data/musicMockData";
import Search from "@/components/Search";

/** 点歌台页面 */
const StationPage = () => {
  // 设置弹窗引用
  const myModalRef = useRef<MyModalExpose>(null);
  // 歌词容器引用
  const lyricContainerRef = useRef<HTMLDivElement>(null);
  const isHoverLyric = useRef<boolean>(false);
  // 用户信息
  const { avatar, username } = useUserInfoStore((state) => state.userInfo);
  // 音乐播放器引用
  const musicPlayerRef = useRef<HTMLAudioElement>(new Audio());
  // 通知组件引用
  const [NotificationApi, NotificationContextHolder] =
    notification.useNotification();
  // 根据索引切换音乐
  const changeMusicByIndex = usePlayerStore(
    (state) => state.changeMusicByIndex,
  );
  // 设置音乐播放器
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  // 设置音乐列表
  const setMusicList = usePlayerStore((state) => state.setMusicList);
  // 当前播放音乐
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  // 添加音乐
  // const addMusic = usePlayerStore((state) => state.addMusic);
  // 当前歌词索引
  const lyricIndex = usePlayerStore((state) => state.lyricIndex);
  // 设置当前播放时间
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
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
    NotificationApi.error({
      title: `《${music?.name}》播放失败`,
      duration: false,
      description: "请检查网络连接或联系管理员",
      placement: "topRight",
    });
  }, []);
  // 音乐播放时间更新处理
  const handelTimeUpdate = useCallback(
    (_music?: MusicVo, _currentTime?: number, lyricIndex?: number) => {
      if (isHoverLyric.current) return;
      if (lyricContainerRef.current) {
        const currentLyric = lyricContainerRef.current.querySelector(
          `#lyric-${lyricIndex}`,
        );
        currentLyric?.scrollIntoView({
          behavior: lyricIndex > 0 ? "smooth" : "instant",
          block: "center",
        });
      }
    },
    [],
  );
  // 设置音乐播放器实例
  useEffect(() => {
    setPlayer({
      player: musicPlayerRef.current!,
      onError: handelMusicError,
      onEnded: handelMusicEnd,
      onTimeUpdate: handelTimeUpdate,
    });
  }, [setPlayer]);
  // 初始切换音乐
  useEffect(() => {
    // Promise.all([
    //   getMusicInfo("答案"),
    //   getMusicInfo("犯贱"),
    //   getMusicInfo("等下完这场雨后弦"),
    //   getMusicInfo("素颜"),
    // ]).then((res) => {
    //   console.log("获取音乐信息成功", res);
    //   setMusicList([...res.map((item) => item.data)]);
    //   setTimeout(() => {
    //     changeMusicByIndex(0);
    //     setIsLoaded(true);
    //   }, 1000);
    // });
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
  }, []);
  return (
    <>
      <LoadingPage isVisible={!isLoaded} />
      {NotificationContextHolder}
      {/* 设置弹窗 */}
      <MyModal ref={myModalRef} title="设置" />
      <div className="relative w-screen h-screen bg-[#7c756d] overflow-hidden">
        {/* 背景层 */}
        <BlurBackground imageSrc={currentMusic?.cover} />
        {/* 遮罩层 */}
        <div className="z-2 w-full h-full fixed left-0 top-0 bg-[rgba(0,0,0,0.35)]"></div>
        {/* 内容层 */}
        <main className="z-3 w-full h-full fixed left-0 top-0 flex flex-col">
          {/* 头部容器 */}
          <header className="flex p-5 justify-between items-center text-white">
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
          <div className="flex-1 flex pt-2">
            <div className="flex-1 pl-12.5 flex flex-col">
              {/* 操作栏 */}
              <div className="grid grid-cols-5">
                <div className="col-start-5 col-end-6  text-white opacity-50 transition-opacity duration-300 hover:opacity-100">
                  <Popconfirm
                    title="清空列表"
                    description="确定清空播放列表吗？"
                    onConfirm={() => {
                      setMusicList([]);
                    }}
                    okButtonProps={{
                      classNames: {
                        root: "bg-primary! text-white hover:bg-secondary!",
                      },
                    }}
                    cancelButtonProps={{
                      classNames: {
                        root: "text-primary hover:text-secondary!",
                      },
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <div className="flex gap-2 items-center justify-center cursor-pointer">
                      <AiOutlineClear />
                      清空列表
                    </div>
                  </Popconfirm>
                </div>
              </div>
              {/* 播放列表 */}
              <MusicList />
            </div>
            {/* 当前播放音乐信息容器 */}
            <div className="w-75 h-full flex flex-col items-center overflow-hidden">
              {/* 当前播放音乐封面 */}
              <div className="relative w-50 h-50 rounded-md overflow-hidden">
                <Image
                  width={200}
                  height={200}
                  className=" block"
                  preview={false}
                  src={
                    !Boolean(currentMusic?.cover)
                      ? defaultCover
                      : currentMusic.cover
                  }
                  fallback={defaultCover}
                  alt=""
                />
              </div>
              {/* 当前播放音乐信息 */}
              <div className="mt-4 text-center text-sm opacity-50 text-white flex flex-col gap-2 ">
                <div>歌曲名：{currentMusic?.name}</div>
                <div>歌手：{currentMusic?.singer}</div>
              </div>
              {/* 歌词容器 */}
              <div
                ref={lyricContainerRef}
                onMouseEnter={() => (isHoverLyric.current = true)}
                onMouseLeave={() => (isHoverLyric.current = false)}
                style={{
                  maskImage:
                    "linear-gradient(180deg, hsla(0, 0%, 100%, 0) 0, hsla(0, 0%, 100%, .6) 15%, #fff 25%, #fff 75%, hsla(0, 0%, 100%, .6) 85%, hsla(0, 0%, 100%, 0))",
                  WebkitMaskImage:
                    "linear-gradient(180deg, hsla(0, 0%, 100%, 0) 0, hsla(0, 0%, 100%, .6) 15%, #fff 25%, #fff 75%, hsla(0, 0%, 100%, .6) 85%, hsla(0, 0%, 100%, 0))",
                  scrollbarWidth: "none",
                }}
                className="w-full  flex-1 relative overflow-y-scroll"
              >
                <div className="w-full py-10 absolute left-0 flex flex-col  gap-1 pr-2">
                  {currentMusic?.lyric?.map((item, index) => (
                    <div
                      style={{
                        color: lyricIndex === index ? "#31c27c" : "#fff",
                      }}
                      onClick={() => setCurrentTime(item.time / 1000)}
                      id={`lyric-${index}`}
                      key={index}
                      className={`text-[14px] select-none cursor-pointer text-white opacity-50 text-center py-1 transition-opacity duration-300 ${lyricIndex === index && "opacity-100"}`}
                    >
                      {item.txt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 底部音乐播放器 */}
          <MusicController />
        </main>
      </div>
    </>
  );
};
export default StationPage;

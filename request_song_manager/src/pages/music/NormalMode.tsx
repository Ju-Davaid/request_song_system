import { Popconfirm } from "antd";
import usePlayStore from "@/store/player.store";
import MusicList from "@/components/MusicList";
import { AiOutlineClear } from "react-icons/ai";
import Lyric from "@/components/Lyric";
import { useEffect, useRef } from "react";
import useCoverStore from "@/store/cover.store";

const NormalMode = () => {
  const currentMusic = usePlayStore((state) => state.currentMusic);
  const setMusicList = usePlayStore((state) => state.setMusicList);
  const coverPlaceholder = useRef<HTMLDivElement>(null);
  const setCoverPosition = useCoverStore((state) => state.setCoverPosition);
  useEffect(() => {
    if (coverPlaceholder.current) {
      setCoverPosition(coverPlaceholder.current.getBoundingClientRect());
    }
  }, [coverPlaceholder.current]);
  useEffect(() => {
    const handelResize = () => {
      if (coverPlaceholder.current) {
        setCoverPosition(coverPlaceholder.current.getBoundingClientRect());
      }
    };
    window.addEventListener("resize", handelResize);
    return () => {
      window.removeEventListener("resize", handelResize);
    };
  }, [setCoverPosition]);
  return (
    <>
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
        {/* 当前播放音乐封面占位符 */}
        <div
          ref={coverPlaceholder}
          className="relative size-50 rounded-md overflow-hidden"
        ></div>
        {/* 当前播放音乐信息 */}
        <div className="mt-4 text-center text-sm opacity-50 text-white flex flex-col gap-2 ">
          <div>歌曲名：{currentMusic?.name}</div>
          <div>歌手：{currentMusic?.singer}</div>
        </div>
        <Lyric classNames={{ root: "flex-1!", lyricContainer: "pr-5" }} />
      </div>
    </>
  );
};

export default NormalMode;

import diskImage from "@/assets/images/disk.png";
import usePlayerStore from "@/store/player.store";
import Lyric from "@/components/Lyric";
import useCoverStore from "@/store/cover.store";
import { useEffect, useRef, useState } from "react";
import FloatMusicList from "@/components/FloatMusicList";

/**
 * 纯净模式组件
 */
const PureMode = () => {
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const coverPlaceholder = useRef<HTMLDivElement>(null);
  const setCoverPosition = useCoverStore((state) => state.setCoverPosition);
  const [isOpenMusicList, setIsOpenMusicList] = useState<boolean>(false);
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
    <div className="h-full flex my-0 mx-auto gap-50">
      <FloatMusicList
        isOpenMusicList={isOpenMusicList}
        setIsOpenMusicList={setIsOpenMusicList}
      />
      {/* 当前播放音乐封面唱片容器 */}
      <div className="flex justify-center items-center">
        <div
          className={`size-92 relative animate-rotate-360 ${!isPlaying && "animate-pause"}`}
        >
          <img
            src={diskImage}
            alt=""
            className="w-full h-full block left-0 top-0"
          />
          {/* 封面位置 */}
          <div
            ref={coverPlaceholder}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full size-[193.68px]"
          ></div>
        </div>
      </div>
      <div className="w-105 flex flex-col items-center">
        <div className="text-2xl w-full text-center text-white font-bold">
          {currentMusic?.name}
        </div>
        <div className="mt-2 mb-5 text-[14px] w-full text-center text-white opacity-80 font-medium">
          {currentMusic?.singer}
        </div>
        <Lyric
          classNames={{
            root: "flex-1 mb-3",
            lyricItem: "text-[18px]",
          }}
        />
      </div>
    </div>
  );
};

export default PureMode;

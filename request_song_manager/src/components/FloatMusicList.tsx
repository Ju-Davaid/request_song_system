import { motion } from "motion/react";
import { useCallback, useEffect, useRef, type FC } from "react";
import { IoIosClose, IoIosArrowBack } from "react-icons/io";
import { List, Image } from "antd";
import VirtualList from "@rc-component/virtual-list";
import usePlayerStore from "@/store/player.store";
import { AiOutlineDelete } from "react-icons/ai";
import { formatSecondToTime } from "@/utils";
import { FaPlay, FaPause } from "react-icons/fa";
import type { MusicVo } from "@/types/Music";

interface FloatMusicListProps {
  isOpenMusicList: boolean;
  setIsOpenMusicList: (isOpenMusicList: boolean) => void;
}
/**
 * 浮动音乐列表组件
 * @param isOpenMusicList 是否显示音乐列表
 * @param setIsOpenMusicList 设置是否显示音乐列表的函数
 */
const FloatMusicList: FC<FloatMusicListProps> = ({
  isOpenMusicList,
  setIsOpenMusicList,
}) => {
  const listContainer = useRef<HTMLDivElement>(null);
  const musicContainer = useRef<HTMLDivElement>(null);
  const musicList = usePlayerStore((state) => state.musicList);
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const changeMusic = usePlayerStore((state) => state.changeMusic);
  const handelPlay = useCallback(
    (item: MusicVo) => {
      if (item.songmid === currentMusic?.songmid) {
        togglePlay();
      } else {
        changeMusic(item);
      }
    },
    [isPlaying, currentMusic, togglePlay, changeMusic],
  );
  useEffect(() => {
    const handelClickOutside = (e: MouseEvent) => {
      if (!musicContainer.current?.contains(e.target as Node)) {
        setIsOpenMusicList(false);
      }
    };
    document.addEventListener("click", handelClickOutside);
    return () => {
      document.removeEventListener("click", handelClickOutside);
    };
  }, []);

  return (
    <motion.div
      ref={musicContainer}
      initial={{
        x: "0",
      }}
      animate={{
        x: isOpenMusicList ? "-90%" : "0",
      }}
      transition={{
        type: "spring",
        duration: 0.3,
      }}
      className="absolute z-2 -right-100 top-1/2 transform -translate-y-1/2 h-120 flex items-center "
    >
      <div
        onClick={() => setIsOpenMusicList(!isOpenMusicList)}
        className="cursor-pointer bg-[#29292B] p-2 rounded-l-full text-white"
      >
        {isOpenMusicList ? (
          <IoIosClose className="text-xl animate-pulse" />
        ) : (
          <IoIosArrowBack className="text-xl animate-pulse" />
        )}
      </div>
      <div className="py-5 flex flex-col h-full w-100 rounded-l-lg bg-[#29292B]">
        <div className="text-white flex justify-between items-center px-5">
          <div className="relative flex items-center gap-2">
            <span className="text-md font-bold">播放列表</span>
            <span className="text-xs opacity-50 translate-y-0.5">
              共{musicList.length}首歌曲
            </span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer opacity-50 transition-opacity duration-300 hover:opacity-100">
            <AiOutlineDelete size={24} />
            清空
          </div>
        </div>
        <div className="flex-1 relative mt-2" ref={listContainer}>
          <List className="w-full absolute! left-0 top-0 px-3!" split={false}>
            <VirtualList
              data={musicList}
              height={listContainer.current?.clientHeight ?? 0}
              itemHeight={70}
              itemKey="songmid"
            >
              {(item) => (
                <List.Item className="p-0!" key={item.songmid}>
                  <div className="flex group w-full hover:bg-[#353537] rounded-md text-white items-center justify-between gap-5 p-2 transition-colors duration-300">
                    <div className="flex items-center gap-5">
                      <div className="size-12.5 rounded-md overflow-hidden relative">
                        <Image
                          src={item.cover}
                          alt={item.name}
                          width="100%"
                          height="100%"
                          preview={false}
                        />
                        <div className="w-full h-full bg-[rgba(0,0,0,0.3)] absolute top-0 left-0 flex items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100">
                          {isPlaying &&
                          item.songmid === currentMusic?.songmid ? (
                            <FaPause
                              size={14}
                              className="opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                              onClick={() => handelPlay(item)}
                            />
                          ) : (
                            <FaPlay
                              size={14}
                              className="opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                              onClick={() => handelPlay(item)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="text-sm w-fit max-w-20 text-center">
                        <div className="line-clamp-1">{item.name}</div>
                        <div className="text-xs opacity-50 line-clamp-1">
                          {item.singer}
                        </div>
                      </div>
                    </div>
                    <div className="opacity-50">
                      {formatSecondToTime(item.duration)}
                    </div>
                  </div>
                </List.Item>
              )}
            </VirtualList>
          </List>
        </div>
      </div>
    </motion.div>
  );
};

export default FloatMusicList;

import { motion } from "motion/react";
import { useRef, type FC } from "react";
import { IoIosClose, IoIosArrowBack, IoMdDownload } from "react-icons/io";
import { List, Image, Popconfirm } from "antd";
import VirtualList from "@rc-component/virtual-list";
import usePlayerStore from "@/store/player.store";
import { AiOutlineDelete } from "react-icons/ai";
import { formatSecondToTime } from "@/utils";
import { FaPlay, FaPause } from "react-icons/fa";
import playingImage from "@/assets/images/playing.gif";
import Empty from "./Empty";
import useOperateMusicList from "@/hooks/useOperateMusicList";

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
  const container = useRef<HTMLDivElement>(null);
  const listContainer = useRef<HTMLDivElement>(null);
  const musicList = usePlayerStore((state) => state.musicList);
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const {
    downloadMusic,
    clearAll,
    deleteMusic,
    toggleOrPauseMusic,
  } = useOperateMusicList();

  return (
    <>
      <motion.div
        ref={container}
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
            <Popconfirm
              title="清空列表"
              description="确定清空播放列表吗？"
              onConfirm={clearAll}
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
              <div className="flex items-center cursor-pointer opacity-50 transition-opacity duration-300 hover:opacity-100">
                <AiOutlineDelete size={24} />
                清空
              </div>
            </Popconfirm>
          </div>
          <div className="flex-1 relative mt-2" ref={listContainer}>
            {musicList.length === 0 ? (
              <Empty />
            ) : (
              <List
                className="w-full absolute! left-0 top-0 px-3!"
                split={false}
              >
                <VirtualList
                  data={musicList}
                  height={listContainer.current?.clientHeight ?? 0}
                  itemHeight={66}
                  itemKey="songmid"
                >
                  {(song) => (
                    <List.Item className="p-0!" key={song.songmid}>
                      <div className="flex group w-full hover:bg-[#353537] rounded-md text-white items-center justify-between gap-5 p-2 transition-colors duration-300">
                        <div className="flex items-center gap-5">
                          <div className="size-12.5 rounded-md overflow-hidden relative">
                            <Image
                              src={song.cover}
                              alt={song.name}
                              width="100%"
                              height="100%"
                              preview={false}
                            />
                            <div
                              className={`w-full h-full bg-[rgba(0,0,0,0.3)] absolute top-0 left-0 flex items-center justify-center rounded-md ${isPlaying && song.songmid === currentMusic?.songmid ? "opacity-100" : "opacity-0"} transition-opacity group-hover:opacity-100`}
                            >
                              {isPlaying &&
                              song.songmid === currentMusic?.songmid ? (
                                <>
                                  <FaPause
                                    size={14}
                                    className={`${isPlaying ? "opacity-0" : "opacity-80"} relative z-2 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-300 cursor-pointer`}
                                    onClick={() => toggleOrPauseMusic(song)}
                                  />
                                  <img
                                    src={playingImage}
                                    alt="playing"
                                    className="absolute left-1/2 -translate-x-1/2  top-1/2 -translate-y-1/2 size-2.5 object-cover transition-opacity duration-300 group-hover:opacity-0"
                                  />
                                </>
                              ) : (
                                <FaPlay
                                  size={14}
                                  className="opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                  onClick={() => toggleOrPauseMusic(song)}
                                />
                              )}
                            </div>
                          </div>
                          <div className="text-sm w-fit max-w-20 text-center">
                            <div className="line-clamp-1">{song.name}</div>
                            <div className="text-xs opacity-50 line-clamp-1">
                              {song.singer}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 h-full flex items-center justify-end gap-2">
                          <Popconfirm
                            title="删除歌曲"
                            description="确定删除歌曲吗？"
                            onConfirm={() => deleteMusic(song)}
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
                            <AiOutlineDelete
                              size={20}
                              className="cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-50 hover:opacity-100"
                            />
                          </Popconfirm>

                          <IoMdDownload
                            size={20}
                            onClick={() => downloadMusic(song)}
                            className="cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-50 hover:opacity-100"
                          />
                        </div>
                        <div className="opacity-50">
                          {formatSecondToTime(song.duration ?? 0)}
                        </div>
                      </div>
                    </List.Item>
                  )}
                </VirtualList>
              </List>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FloatMusicList;

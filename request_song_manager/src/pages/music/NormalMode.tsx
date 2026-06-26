import { Popconfirm } from "antd";
import usePlayStore from "@/store/player.store";
import MusicList from "@/components/MusicList";
import { AiOutlineClear } from "react-icons/ai";
import Lyric from "@/components/Lyric";
import { useEffect, useRef } from "react";
import useCoverStore from "@/store/cover.store";
import useOperateMusicList from "@/hooks/useOperateMusicList";
import { FaList } from "react-icons/fa6";
import useMusicBatchOperateStore from "@/store/musicBatchOperate.store";
import { MdDeleteSweep } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";

/**
 * 正常模式组件
 */
const NormalMode = () => {
  const currentMusic = usePlayStore((state) => state.currentMusic);
  const coverPlaceholder = useRef<HTMLDivElement>(null);
  const setCoverPosition = useCoverStore((state) => state.setCoverPosition);
  const isBatchOperation = useMusicBatchOperateStore(
    (state) => state.isBatchOperation,
  );
  const toggleBatchOperation = useMusicBatchOperateStore(
    (state) => state.toggleBatchOperation,
  );
  const isBatchDeleting = useMusicBatchOperateStore(
    (state) => state.isBatchDeleting,
  );
  const isBatchDownloading = useMusicBatchOperateStore(
    (state) => state.isBatchDownloading,
  );
  const {
    clearAll,
    MessageContextHolder,
    batchDeleteMusic,
    batchDownloadMusic,
  } = useOperateMusicList();
  // 监听播放列表变化，更新封面位置
  useEffect(() => {
    if (coverPlaceholder.current) {
      setCoverPosition(coverPlaceholder.current.getBoundingClientRect());
    }
  }, [coverPlaceholder.current]);
  // 监听窗口变化，更新封面位置
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
        <div className="flex justify-end gap-30 px-20">
          {isBatchOperation && (
            <>
              <div
                onClick={batchDeleteMusic}
                className="text-white opacity-50 transition-opacity duration-300 hover:opacity-100"
              >
                <div className="flex gap-2 items-center justify-end cursor-pointer">
                  <MdDeleteSweep size={20} />
                  {isBatchOperation && isBatchDeleting ? "删除中" : "批量删除"}
                </div>
              </div>
              <div className="text-white opacity-50 transition-opacity duration-300 hover:opacity-100">
                <div
                  onClick={batchDownloadMusic}
                  className="flex gap-2 items-center justify-end cursor-pointer"
                >
                  <FaDownload size={20} />
                  {isBatchOperation && isBatchDownloading
                    ? "下载中"
                    : "批量下载"}
                </div>
              </div>
            </>
          )}
          <div
            className={`text-white ${isBatchOperation ? "opacity-100" : "opacity-50"} transition-opacity duration-300 hover:opacity-100`}
          >
            <div
              onClick={toggleBatchOperation}
              className="flex gap-2 items-center justify-end cursor-pointer"
            >
              <FaList />
              批量操作
            </div>
          </div>
          <div className="text-white opacity-50 transition-opacity duration-300 hover:opacity-100">
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
              <div className="flex gap-2 items-center justify-center cursor-pointer">
                <AiOutlineClear size={20} />
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
      {MessageContextHolder}
    </>
  );
};

export default NormalMode;

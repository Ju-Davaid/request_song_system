import type { MusicVo } from "@/types/Music";
import { formatSecondToTime } from "@/utils";
import playingImage from "@/assets/images/playing.gif";
import { IoIosMore, IoIosCheckboxOutline, IoIosCheckbox } from "react-icons/io";
import { useCallback, useMemo, type ReactNode } from "react";
import usePlayerStore from "@/store/player.store";
import useMusicBatchOperateStore from "@/store/musicBatchOperate.store";
import { Popover } from "antd";
import { FaPlay, FaPause } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdDownload } from "react-icons/io";
import useOperateMusicList from "@/hooks/useOperateMusicList";

export interface DataType extends MusicVo {
  order: number;
}

export interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  render?: (
    dataSource: DataType,
    isPlaying?: boolean,
    isChecked?: boolean,
  ) => ReactNode;
}

/**
 * 构建批量操作列
 * @param isBatchOperation 是否为批量操作模式
 * @param handleSelectItem 单选处理函数
 * @returns 批量操作列对象
 */
const firstColumn = (
  isBatchOperation: boolean = false,
  checkedList: string[],
  handleSelectItem: (songmid: string) => void,
): ColumnType => {
  const batchOperation: ColumnType = {
    title: "批量操作",
    key: "batchOperation",
    dataIndex: "batchOperation",
    render: (_item: DataType, _isPlaying: boolean = false) => (
      <div
        className="flex items-center justify-center"
        onClick={() => handleSelectItem(_item.songmid ?? "")}
      >
        {!checkedList.includes(_item.songmid ?? "") ? (
          <IoIosCheckboxOutline className="text-2xl cursor-pointer my-0 mx-auto" />
        ) : (
          <IoIosCheckbox className="text-2xl cursor-pointer my-0 mx-auto" />
        )}
      </div>
    ),
  };
  const noBatchOperation: ColumnType = {
    title: "序号",
    dataIndex: "order",
    key: "order",
  };
  return isBatchOperation ? batchOperation : noBatchOperation;
};

/**
 * 构建表格渲染数据
 * @param musicList 音乐列表
 * @param isBatchOperation 是否为批量操作模式
 * @returns 表格渲染数据对象
 */
export const useBuildTableRenderData = () => {
  const musicList = usePlayerStore((state) => state.musicList);
  const checkedList = useMusicBatchOperateStore((state) => state.checkedList);
  const { deleteMusic, downloadMusic, toggleOrPauseMusic } =
    useOperateMusicList();
  const setCheckedList = useMusicBatchOperateStore(
    (state) => state.setCheckedList,
  );
  const isBatchOperation = useMusicBatchOperateStore(
    (state) => state.isBatchOperation,
  );
  // 单选
  const handleSelectItem = useCallback(
    (songmid: string) => {
      if (checkedList.includes(songmid)) {
        setCheckedList(checkedList.filter((item) => item !== songmid));
      } else {
        setCheckedList([...checkedList, songmid]);
      }
    },
    [checkedList],
  );
  // 构建表格渲染数据
  const dataSource: DataType[] = useMemo(
    () =>
      musicList.map((item, index) => ({
        ...item,
        order: index + 1,
      })),
    [musicList],
  );
  // 构建表格列
  const columns: ColumnType[] = useMemo(
    () => [
      firstColumn(isBatchOperation, checkedList, handleSelectItem),
      {
        title: "歌曲",
        dataIndex: "name",
        key: "name",
        render: (item: DataType, isPlaying: boolean = false) => (
          <div
            title={item.name}
            className="flex gap-2 items-center justify-center text-white"
          >
            {isPlaying && (
              <img
                src={playingImage}
                alt="playing"
                className="size-2.5 object-cover"
              />
            )}
            {item.name.length > 10
              ? item.name.substring(0, 10) + "..."
              : item.name}
          </div>
        ),
      },
      {
        title: "歌手",
        dataIndex: "singer",
        key: "singer",
      },
      {
        title: "时长",
        dataIndex: "duration",
        key: "duration",
        render: (item: DataType) => formatSecondToTime(item.duration as number),
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        render: (song: DataType, isPlaying: boolean = false) => (
          <Popover
            trigger="hover"
            color="#29292B"
            classNames={{
              container: "p-0! rounded-md! overflow-hidden",
            }}
            content={
              <div className="w-30 py-2 text-white">
                <div
                  onClick={() => toggleOrPauseMusic(song)}
                  className="flex py-2 cursor-pointer hover:bg-[#353537] transition-colors duration-300 px-3.5 gap-5 items-center text-xs"
                >
                  {isPlaying ? (
                    <>
                      <FaPause className="ml-1" /> 暂停
                    </>
                  ) : (
                    <>
                      <FaPlay className="ml-1" /> 播放
                    </>
                  )}
                </div>
                <div
                  onClick={() => deleteMusic(song)}
                  className="flex py-2 cursor-pointer hover:bg-[#353537] transition-colors duration-300 px-3.5 gap-5 items-center text-xs"
                >
                  <AiOutlineDelete size={18} /> 删除
                </div>
                <div
                  onClick={() => downloadMusic(song)}
                  className="flex py-2 cursor-pointer hover:bg-[#353537] transition-colors duration-300 px-3.5 gap-5 items-center text-xs"
                >
                  <IoMdDownload size={18} /> 下载
                </div>
              </div>
            }
          >
            <IoIosMore className="text-2xl cursor-pointer my-0 mx-auto text-white" />
          </Popover>
        ),
      },
    ],
    [
      isBatchOperation,
      checkedList,
      toggleOrPauseMusic,
      deleteMusic,
      downloadMusic,
    ],
  );

  return { dataSource, columns };
};

export default useBuildTableRenderData;

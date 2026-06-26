import type { MusicVo } from "@/types/Music";
import { formatSecondToTime } from "../utils";
import playingImage from "@/assets/images/playing.gif";
import { IoIosMore, IoIosCheckboxOutline, IoIosCheckbox } from "react-icons/io";
import { useCallback, useMemo, type ReactNode } from "react";
import usePlayerStore from "@/store/player.store";
import useMusicBatchOperateStore from "@/store/musicBatchOperate.store";

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
    render: (
      _item: DataType,
      _isPlaying: boolean = false,
      isChecked: boolean = false,
    ) => (
      <div
        className="flex items-center justify-center"
        onClick={() => handleSelectItem(_item.songmid)}
      >
        {!checkedList.includes(_item.songmid) ? (
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
  const setCheckedList = useMusicBatchOperateStore(
    (state) => state.setCheckedList,
  );
  const isBatchOperation = useMusicBatchOperateStore(
    (state) => state.isBatchOperation,
  );
  // 全选
  const handleSelectAll = useCallback(() => {
    if (checkedList.length === dataSource.length) {
      setCheckedList([]);
    } else {
      setCheckedList(dataSource.map((item) => item.songmid));
    }
  }, [checkedList]);

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
        render: (_item: DataType) => (
          <div className="relative w-full h-full text-white">
            <IoIosMore className="text-2xl cursor-pointer my-0 mx-auto" />
          </div>
        ),
      },
    ],
    [isBatchOperation, checkedList],
  );

  return { dataSource, columns };
};

export default useBuildTableRenderData;

import type { MusicVo } from "@/types/Music";
import { formatSecondToTime } from ".";
import playingImage from "@/assets/images/playing.gif";
import { IoIosMore } from "react-icons/io";

export interface DataType extends MusicVo {
  order: number;
}

export interface ColumnType {
  title: string;
  dataIndex: keyof DataType;
  key: string;
  render?: (item: DataType) => React.ReactNode;
}

export const buildTableRenderData = (musicList: MusicVo[]) => {
  const dataSource: DataType[] = musicList.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
  const columns = [
    {
      title: "序号",
      dataIndex: "order",
      key: "order",
    },
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
            ? item.name.substring(0, 20) + "..."
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
        <div className="flex gap-2 items-center justify-center text-white">
          <IoIosMore className="text-2xl cursor-pointer" />
        </div>
      ),
    },
  ];
  return { dataSource, columns };
};

export default buildTableRenderData;

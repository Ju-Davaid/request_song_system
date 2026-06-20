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
    duration: formatSecondToTime(item.duration as number),
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
        <div className="flex gap-2 items-center justify-center text-white">
          {isPlaying && (
            <img
              src={playingImage}
              alt="playing"
              className="size-2.5 object-cover"
            />
          )}
          {item.name}
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

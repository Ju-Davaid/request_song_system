import usePlayerStore from "@/store/player.store";
import { buildTableRenderData } from "@/utils";
import { Checkbox } from "antd";
import { useCallback, useState } from "react";

const MusicList = () => {
  const musicList = usePlayerStore((state) => state.musicList);
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  const { dataSource, columns } = buildTableRenderData(musicList);
  const [checkedList, setCheckedList] = useState<string[]>([]);

  // 全选
  const handleSelectAll = useCallback(() => {
    if (checkedList.length === dataSource.length) {
      setCheckedList([]);
    } else {
      setCheckedList(dataSource.map((item) => item.songmid));
    }
  }, [dataSource, checkedList]);

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

  return (
    <div className="flex-1 my-5 text-sm text-white">
      {/* 表头 */}
      <ul className="flex w-full text-center mb-2">
        <li className="flex-1 py-3 px-2 font-medium opacity-80">
          <Checkbox
            onChange={handleSelectAll}
            checked={
              checkedList.length === dataSource.length && dataSource.length > 0
            }
          />
        </li>
        {columns.map((column) => (
          <li
            key={column.dataIndex}
            className="flex-1 py-3 px-2 font-medium opacity-80"
          >
            {column.title}
          </li>
        ))}
      </ul>
      {/* 数据行 */}
      <div className="w-full relative h-[calc(100%-46px)] overflow-y-auto music-list-scrollbar">
        <ul className="w-full overflow-y-auto music-list-scrollbar absolute left-0 top-0">
          {dataSource.map((item) => (
            <li
              key={item.key}
              className="flex w-full text-center transition-colors"
            >
              {/* 复选框单元格 */}
              <div className="flex-1 py-3 px-2 opacity-80">
                <Checkbox
                  onChange={() => handleSelectItem(item.songmid)}
                  checked={checkedList.includes(item.songmid)}
                />
              </div>
              {/* 数据单元格 */}
              {columns.map((column) => (
                <div
                  key={column.dataIndex}
                  className={`flex-1 py-3 px-2 transition-opacity duration-300 ${
                    (
                      currentMusic
                        ? currentMusic?.songmid === item.songmid
                        : false
                    )
                      ? "opacity-100"
                      : "opacity-80"
                  }`}
                >
                  {column.render?.(
                    item,
                    currentMusic
                      ? currentMusic?.songmid === item.songmid
                      : false,
                  ) ?? item[column.dataIndex]}
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicList;

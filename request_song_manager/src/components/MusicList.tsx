import usePlayerStore from "@/store/player.store";
import { buildTableRenderData, type DataType } from "@/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { List } from "antd";
import VirtualList from "@rc-component/virtual-list";
import Empty from "./Empty";

const MusicList = () => {
  const musicList = usePlayerStore((state) => state.musicList);
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  const { dataSource, columns } = useMemo(
    () => buildTableRenderData(musicList),
    [musicList],
  );
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const dataContainerRef = useRef<HTMLDivElement>(null);

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
      <ul className="grid grid-cols-5 w-full text-center mb-2">
        {columns.map((column) => (
          <li
            key={column.dataIndex}
            className="py-3 px-2 font-medium opacity-80"
          >
            {column.title}
          </li>
        ))}
      </ul>
      {/* 数据行 */}
      <div
        ref={dataContainerRef}
        className="w-full relative h-[calc(100%-46px)]"
      >
        {dataSource.length === 0 ? (
          <Empty />
        ) : (
          <List className="w-full absolute! left-0 top-0" split={false}>
            <VirtualList
              data={dataSource}
              height={dataContainerRef.current?.clientHeight ?? 0}
              itemHeight={70}
              itemKey="songmid"
            >
              {(item: DataType) => (
                <List.Item key={item.songmid}>
                  <div className="grid grid-cols-5 w-full text-center transition-colors">
                    {/* 数据单元格 */}
                    {columns.map((column) => (
                      <div
                        key={column.dataIndex}
                        className={`text-white py-3 px-2 transition-opacity duration-300${
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
                  </div>
                </List.Item>
              )}
            </VirtualList>
          </List>
        )}
      </div>
    </div>
  );
};

export default MusicList;

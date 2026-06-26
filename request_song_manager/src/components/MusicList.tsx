import usePlayerStore from "@/store/player.store";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { List } from "antd";
import VirtualList from "@rc-component/virtual-list";
import Empty from "@/components/Empty";
import useBuildTableRenderData, {
  type DataType,
} from "@/hooks/useBuildTableRenderData";


/**
 * 音乐列表组件
 */
const MusicList: FC = () => {
  const currentMusic = usePlayerStore((state) => state.currentMusic);
  const { dataSource, columns } = useBuildTableRenderData();
  // 监听数据行高度变化，更新虚拟列表高度
  const dataContainerRef = useRef<HTMLDivElement>(null);

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
                        className={`text-white py-3 px-2 transition-opacity duration-300 ${
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

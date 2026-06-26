import { Input } from "antd";
import { useCallback, useState, useRef, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { debounce } from "@/utils";
import { addMusicToDB, getSearchResult } from "@/api";
import type { SearchVo } from "@/types/Music";
import usePlayerStore from "@/store/player.store";
import useMessage from "@/hooks/useMessage";
import { Image, List } from "antd";
import defaultCover from "@/assets/images/default_cover.jpg";
import { AiOutlineDelete } from "react-icons/ai";
import VirtualList from "@rc-component/virtual-list";

/**
 * 搜索组件
 */
const Search = () => {
  // 输入值
  const [inputValue, setInputValue] = useState("");
  // 下拉弹窗显示
  const [isVisibleSearch, setIsVisibleSearch] = useState(false);
  // 搜索结果
  const [searchResult, setSearchResult] = useState<SearchVo[]>([]);
  // 容器DOM，用于点击外部关闭
  const containerRef = useRef<HTMLDivElement>(null);
  // 记录最新搜索标识，解决接口竞态
  const latestSearchKey = useRef("");
  // 点歌函数
  const addMusic = usePlayerStore((state) => state.addMusic);
  // 本地搜索历史记录
  const [localHistoryList, setLocalHistoryList] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("historyList") ?? "[]"),
  );
  const musicList = usePlayerStore((state) => state.musicList);
  const message = useMessage();
  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!containerRef.current?.contains(target)) {
        setInputValue("");
        setSearchResult([]);
        setIsVisibleSearch(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //防抖搜索核心，抽离纯请求逻辑
  const fetchSearchData = useCallback(async (text: string) => {
    try {
      if (!text.trim()) {
        setSearchResult([]);
        return;
      }
      latestSearchKey.current = text;
      const res = await getSearchResult(text);
      console.log("搜索结果", res);
      // 只有当前是最新请求才赋值，防止旧接口覆盖新数据
      if (latestSearchKey.current === text) {
        setSearchResult(res.data ?? []);
      }
    } catch (error) {
      console.error("搜索失败", error);
      message.error("搜索失败");
      setSearchResult([]);
    }
  }, []);

  // 防抖搜索
  const debouncedSearch = useCallback(debounce(fetchSearchData, 500), [
    fetchSearchData,
  ]);

  // 取消防抖定时器
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // 输入变更统一处理
  const handleInputChange = useCallback(
    (text: string) => {
      setInputValue(text);
      // 空值直接关闭下拉，不发起请求
      if (!text.trim()) {
        setIsVisibleSearch(false);
        setSearchResult([]);
        return;
      }
      setIsVisibleSearch(true);
      debouncedSearch(text);
    },
    [debouncedSearch],
  );
  const handelAddMusic = useCallback(
    async (item: SearchVo) => {
      const newHistoryList = [...localHistoryList];
      newHistoryList.unshift(`${item.name} - ${item.singer}`);
      console.log("newHistoryList", newHistoryList);
      const listArr = new Set(newHistoryList);
      let res = [...listArr];
      console.log("res", res);
      if (res.length > 5) {
        res = res.splice(0, 5);
      }
      setLocalHistoryList(res);
      localStorage.setItem("historyList", JSON.stringify(res));
      const isExist = musicList.some((music) => music.songmid === item.songmid);
      if (isExist) {
        message.warning("该歌曲已存在");
        return;
      }
      try {
        await addMusicToDB(item);
      } catch (error) {}
      addMusic(item);
    },
    [musicList, localHistoryList],
  );

  return (
    <>
      <div className="relative z-10" ref={containerRef}>
        <Input
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          allowClear={true}
          classNames={{
            root: "w-80! rounded-full!  bg-[rgba(0,0,0,0.3)]! outline-0! border-[#ffffff33]!",
            input:
              "text-white! opacity-50 placeholder:text-white! placeholder:text-sm!",
            clear: "text-white! opacity-50",
          }}
          prefix={<AiOutlineSearch className="text-white opacity-50 text-xl" />}
          placeholder="请输入歌曲或歌手名称"
        />
        {/* 搜索结果列表 */}
        {isVisibleSearch && searchResult.length > 0 && (
          <div className="absolute z-10 rounded-md top-10 left-0 w-full p-2 bg-[#29292B]">
            {/* 点歌历史记录 */}
            {localHistoryList.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="opacity-50 text-xs">点歌历史记录</span>
                  <AiOutlineDelete className="opacity-50 text-xl cursor-pointer" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {localHistoryList.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-2 cursor-pointer items-center justify-between transition-colors duration-300 bg-[#353537] rounded-lg"
                    >
                      <span
                        className="text-xs line-clamp-1 flex-1"
                        title={item}
                      >
                        {item.length > 10 ? item.slice(0, 10) + "..." : item}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="mt-4 flex justify-between items-center">
              <span className="opacity-50 text-xs">搜索结果</span>
            </div>
            <div className="h-70 relative">
              <List className="w-full absolute! left-0 top-0" split={false}>
                <VirtualList
                  data={searchResult}
                  height={280}
                  itemHeight={56}
                  itemKey="songmid"
                >
                  {(song) => (
                    <div
                      key={song.songmid}
                      className="text-white  flex gap-4 p-2 items-center justify-between transition-colors duration-300 hover:bg-[#353537] rounded-sm"
                    >
                      <Image
                        width={40}
                        height={40}
                        preview={false}
                        src={song.cover}
                        className="block rounded-sm"
                        fallback={defaultCover}
                        alt="音乐封面"
                      />
                      <div
                        className="text-sm line-clamp-1 flex-1"
                        title={`${song.name} - ${song.singer}`}
                        dangerouslySetInnerHTML={{
                          __html: Object.values(song.highlight).join(" - "),
                        }}
                      ></div>
                      <button
                        onClick={() => handelAddMusic(song)}
                        className="py-0.5 w-12  rounded-full text-[12px] cursor-pointer bg-primary"
                      >
                        点歌
                      </button>
                    </div>
                  )}
                </VirtualList>
              </List>
            </div>
          </div>
        )}
      </div>
      {message.contextHolder}
    </>
  );
};

export default Search;

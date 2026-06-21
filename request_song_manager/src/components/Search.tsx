import { Input } from "antd";
import { useCallback, useState, useRef, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { debounce } from "@/utils";
import { getSearchResult } from "@/api";
import type { SearchVo } from "@/types/Music";
import usePlayerStore from "@/store/player.store";
import useMessage from "@/hooks/useMessage";

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

  return (
    <>
      <div className="relative" ref={containerRef}>
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
          <div className="absolute z-2 h-100 rounded-md top-10 left-0 w-full p-2 bg-[#29292B]">
            {searchResult.map((song) => (
              <div
                key={song.songmid}
                className="flex gap-4 p-2 items-center justify-between transition-colors duration-300 hover:bg-[#353537] rounded-sm"
              >
                <div
                  className="text-sm line-clamp-1 flex-1"
                  title={`${song.name} - ${song.singer}`}
                  dangerouslySetInnerHTML={{
                    __html: Object.values(song.highlight).join(" - "),
                  }}
                ></div>
                <button
                  onClick={() => {
                    message.success("点歌成功");
                    addMusic(song);
                  }}
                  className="py-0.5 w-12  rounded-full text-[12px] cursor-pointer bg-secondary hover:bg-primary"
                >
                  点歌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {message.contextHolder}
    </>
  );
};

export default Search;

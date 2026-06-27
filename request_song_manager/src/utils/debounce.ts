type DebounceReturn<T extends (...args: any[]) => any> = {
    (...args: Parameters<T>): void;
    cancel: () => void; // 手动取消防抖等待
};

export const debounce = <T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    immediate = false
): DebounceReturn<T> => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const debouncedFn = function (this: unknown, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer);

        if (immediate && !timer) {
            fn.apply(this, args);
        }

        timer = setTimeout(() => {
            if (!immediate) fn.apply(this, args);
            timer = null;
        }, delay);
    };

    // 提供取消方法
    debouncedFn.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = null;
    };

    return debouncedFn;
}

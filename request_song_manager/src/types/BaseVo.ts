export interface BaseVo<T> {
    code: number;
    msg: string;
    data: T;
}
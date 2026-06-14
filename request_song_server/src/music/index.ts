import musicApi from './instance'
import { AxiosRequestConfig, Method, AxiosResponse } from 'axios';
import ResponseViewObject from "../entity/vo/ResponseViewObject"

const handleResponse = (response: AxiosResponse) => {
    const data = response.data;
    if (data.error) {
        return ResponseViewObject.error(data.error);
    }
    return ResponseViewObject.success(data);
}


const requestMusicServer = async (
    url: string,
    method: Method,
    data?: unknown,
    config: AxiosRequestConfig = {}
) => {
    try {
        const m = method.toLowerCase() as Lowercase<Method>;

        switch (m) {
            case 'get':
            case 'head':
            case 'options':
                return handleResponse(await musicApi[m](url, config));
            case 'post':
            case 'put':
            case 'patch':
            case 'delete':
                return handleResponse(await musicApi[m](url, data, config));
            default:
                throw new Error(`不支持的请求方法: ${method}`);
        }
    } catch (err:any) {
        console.error(err);
        return ResponseViewObject.error(err.message);
    }
};

export default requestMusicServer;
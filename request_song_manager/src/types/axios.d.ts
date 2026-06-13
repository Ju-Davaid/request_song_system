import 'axios'
import type { BaseVo } from './BaseVo'

declare module 'axios' {
    interface AxiosResponse<T = unknown> {
        data: BaseVo<T>
    }
}
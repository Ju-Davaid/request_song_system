import { message } from 'antd';
import { useCallback } from 'react';

const useMessage = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const success = useCallback((content: string) => {
        messageApi.open({
            type: 'success',
            content,
        });
    }, [messageApi]);

    const error = useCallback((content: string) => {
        messageApi.open({
            type: 'error',
            content,
        });
    }, [messageApi]);

    const warning = useCallback((content: string) => {
        messageApi.open({
            type: 'warning',
            content,
        });
    }, [messageApi]);

    return {
        success,
        error,
        warning,
        contextHolder,
    };
};

export default useMessage;
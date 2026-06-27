import { useCallback } from 'react';
import { App } from 'antd';

const useMessage = () => {
    const { message, notification } = App.useApp();

    const success = useCallback((content: string) => {
        message.open({
            type: 'success',
            content,
        });
    }, [message]);

    const error = useCallback((content: string) => {
        message.open({
            type: 'error',
            content,
        });
    }, [message]);

    const warning = useCallback((content: string) => {
        message.open({
            type: 'warning',
            content,
        });
    }, [message]);

    return {
        notification,
        message: {
            success,
            error,
            warning,
        }
    };
};

export default useMessage;
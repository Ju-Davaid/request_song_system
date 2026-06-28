import { access } from 'fs/promises';

const isFileExist = async (filePath: string) => {
    try {
        await access(filePath);
        return true;
    } catch (err) {
        return false;
    }
};
export default isFileExist;
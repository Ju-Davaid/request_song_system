import { create } from 'axios';
const musicApiPort = process.env.MUSIC_API_PORT ?? '3200';
const musicApi = create({
    baseURL: `http://localhost:${musicApiPort}`,
    timeout: 10000,
    withCredentials: true,
});
export default musicApi;

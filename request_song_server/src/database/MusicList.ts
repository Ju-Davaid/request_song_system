 import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { MusicVo } from '../entity/vo/MusicVo';
import isFileExist from '../utils/isFileExist';

 export interface MusicCreationAttributes extends Partial<MusicVo> {
    name: string;
    singer: string;
    songmid: string;
    duration: number;
    similarity: number;
}

 export interface MusicData extends MusicVo {
    createdAt?: string;
    updatedAt?: string;
}

 export class MusicListDB {
    private static instance: MusicListDB;
    private readonly filePath: string;
    private data: MusicData[] = [];
    private initialized = false;

    private constructor() {
        this.filePath = join(process.cwd(), 'music.json');
    }

    public static getInstance(): MusicListDB {
        return MusicListDB.instance ??= new MusicListDB();
    }

    private async init(): Promise<void> {
        if (this.initialized) return;
        const fileExists = await isFileExist(this.filePath);
        if (fileExists) {
            try {
                const content = await readFile(this.filePath, 'utf-8');
                this.data = JSON.parse(content);
            } catch {
                this.data = [];
                await this.save();
            }
        } else {
            this.data = [];
            await this.save();
        }
        this.initialized = true;
        console.log('MusicList JSON database initialized');
    }

    private async save(): Promise<void> {
        const content = JSON.stringify(this.data, null, 2);
        const tempPath = this.filePath + '.tmp';
        await writeFile(tempPath, content, 'utf-8');
        const fs = await import('fs');
        fs.default.renameSync(tempPath, this.filePath);
    }

    private async checkInit(): Promise<void> {
        if (!this.initialized) {
            await this.init();
        }
    }

    public async upsertMusic(music: MusicCreationAttributes): Promise<MusicData> {
        await this.checkInit();
        const index = this.data.findIndex(item => item.songmid === music.songmid);
        const now = new Date().toISOString();
        
        if (index >= 0) {
            this.data[index] = { ...this.data[index], ...music, updatedAt: now };
        } else {
            this.data.push({ ...music, createdAt: now, updatedAt: now });
        }
        
        await this.save();
        return this.data[index >= 0 ? index : this.data.length - 1];
    }

    public async upsertMusicBatch(musicList: MusicCreationAttributes[]): Promise<MusicData[]> {
        await this.checkInit();
        const results: MusicData[] = [];
        for (const music of musicList) {
            const result = await this.upsertMusic(music);
            results.push(result);
        }
        return results;
    }

    public async deleteMusic(songmid: string): Promise<boolean> {
        await this.checkInit();
        const initialLength = this.data.length;
        this.data = this.data.filter(item => item.songmid !== songmid);
        if (this.data.length !== initialLength) {
            await this.save();
            return true;
        }
        return false;
    }

    public async deleteMusicBatch(songmids: string[]): Promise<number> {
        await this.checkInit();
        const initialLength = this.data.length;
        const songmidSet = new Set(songmids);
        this.data = this.data.filter(item => !songmidSet.has(item.songmid));
        const deleted = initialLength - this.data.length;
        if (deleted > 0) {
            await this.save();
        }
        return deleted;
    }

    public async clearAll(): Promise<void> {
        await this.checkInit();
        this.data = [];
        await this.save();
    }

    public async getMusicBySongmid(songmid: string): Promise<MusicData | null> {
        await this.checkInit();
        return this.data.find(item => item.songmid === songmid) || null;
    }

    public async getMusicBySongmids(songmids: string[]): Promise<MusicData[]> {
        await this.checkInit();
        const songmidSet = new Set(songmids);
        return this.data.filter(item => songmidSet.has(item.songmid));
    }

    public async getAllMusic(): Promise<MusicData[]> {
        await this.checkInit();
        return [...this.data].sort((a, b) => 
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
    }

    public async getCount(): Promise<number> {
        await this.checkInit();
        return this.data.length;
    }

    public async getTopMusic(limit: number = 10): Promise<MusicData[]> {
        await this.checkInit();
        return [...this.data]
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }
}

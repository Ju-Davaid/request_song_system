import { DataTypes, Model, Optional } from 'sequelize';
import { Lyric, MusicVo } from '../entity/vo/MusicVo';
import seq from './db';

// 定义创建歌曲时的可选字段
export interface MusicCreationAttributes extends Optional<MusicVo, 'url' | 'vip' | 'cover' | 'lyric'> { }

// 定义 MusicList 模型类
class MusicList extends Model<MusicVo, MusicCreationAttributes> implements MusicVo {
    name!: string;
    singer!: string;
    url?: string;
    songmid!: string;
    duration!: number;
    similarity!: number;
    vip?: boolean;
    cover?: string;
    lyric?: Lyric[];
}


// 初始化模型
const initModel = () => {
    MusicList.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        singer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        songmid: {
            primaryKey: true,
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        similarity: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        vip: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        cover: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lyric: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    }, {
        sequelize: seq,
        modelName: 'MusicList',
        tableName: 'music',
        timestamps: true,
    });
};

// 工具类
export class MusicListDB {
    private static instance: MusicListDB;
    private initialized = false;

    private constructor() { }

    // 单例模式获取实例
    public static getInstance(): MusicListDB {
        return MusicListDB.instance ??= new MusicListDB();
    }

    // 初始化数据库和模型
    private async init(): Promise<void> {
        if (this.initialized) return;
        initModel();
        await seq.sync();
        this.initialized = true;
        console.log('MusicList database initialized');
    }

    // 批量添加或更新歌曲
    public async upsertMusic(music: MusicCreationAttributes): Promise<MusicList> {
        await this.checkInit();
        const [musicList] = await MusicList.upsert(music);
        return musicList;
    }

    // 批量添加或更新歌曲
    public async upsertMusicBatch(musicList: MusicCreationAttributes[]): Promise<MusicList[]> {
        await this.checkInit();
        const results: MusicList[] = [];
        for (const music of musicList) {
            const [result] = await MusicList.upsert(music);
            results.push(result);
        }
        return results;
    }

    // 根据 songmid 删除歌曲
    public async deleteMusic(songmid: string): Promise<boolean> {
        await this.checkInit();
        const deleted = await MusicList.destroy({
            where: { songmid },
        });
        return deleted > 0;
    }

    // 批量删除歌曲
    public async deleteMusicBatch(songmids: string[]): Promise<number> {
        await this.checkInit();
        const deleted = await MusicList.destroy({
            where: { songmid: songmids },
        });
        return deleted;
    }

    // 清空所有歌曲
    public async clearAll(): Promise<void> {
        await this.checkInit();
        await MusicList.destroy({ truncate: true });
    }

    // 根据 songmid 获取歌曲
    public async getMusicBySongmid(songmid: string): Promise<MusicList | null> {
        await this.checkInit();
        return await MusicList.findByPk(songmid);
    }

    // 批量获取歌曲
    public async getMusicBySongmids(songmids: string[]): Promise<MusicList[]> {
        await this.checkInit();
        return await MusicList.findAll({
            where: { songmid: songmids },
        });
    }

    // 获取所有歌曲
    public async getAllMusic(): Promise<MusicList[]> {
        await this.checkInit();
        return await MusicList.findAll({
            order: [['createdAt', 'ASC']],
        });
    }

    // 获取歌曲数量
    public async getCount(): Promise<number> {
        await this.checkInit();
        return await MusicList.count();
    }

    // 按相似度获取前N首歌曲
    public async getTopMusic(limit: number = 10): Promise<MusicList[]> {
        await this.checkInit();
        return await MusicList.findAll({
            order: [['similarity', 'DESC']],
            limit,
        });
    }

    // 检查是否已初始化
    private async checkInit(): Promise<void> {
        if (!this.initialized) {
            await this.init();
        }
    }
}

// 导出单例
export default MusicListDB.getInstance();
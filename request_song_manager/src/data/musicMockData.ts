import music1 from "@/assets/audio/恋人（李荣浩）.mp3";
import music2 from "@/assets/audio/牵丝戏.mp3";
import music3 from "@/assets/audio/we don't any more.mp3";

export type MusicItem = {
    cover: string,
    title: string,
    singer: string,
    url: string,
    lyric: string,
}

const musicList: MusicItem[] = [
    // 恋人-李荣浩
    {
        cover: "https://img2.kuwo.cn/star/albumcover/500/s3s1/57/2520331350.jpg",
        title: "恋人",
        singer: "李荣浩",
        url: music1,
        lyric: "[00:00.99]恋人 - 李荣浩\n" +
            "[00:03.63]词：刘嘉星\n" +
            "[00:06.18]曲：刘嘉星\n" +
            "[00:07.9]编曲：李荣浩\n" +
            "[00:09.75]制作人：李荣浩\n" +
            "[00:11.77]吉他：李荣浩\n" +
            "[00:13.06]贝斯：李荣浩\n" +
            "[00:13.33]弦乐：国际首席爱乐乐团\n" +
            "[00:15.29]和音：李荣浩\n" +
            "[00:16.46]录音师：李荣浩\n" +
            "[00:18.59]混音师：李荣浩\n" +
            "[00:19.63]音乐制作助理：青格乐\n" +
            "[00:20.03]录音工作室：北京一样音乐录音室\n" +
            "[00:21.88]混音工作室：北京一样音乐录音室\n" +
            "[00:23.01]母带后期制作人：李荣浩\n" +
            "[00:23.47]母带后期处理工程师：周天澈\n" +
            "[00:24.0]母带后期处理录音室：Studio 21A\n" +
            "[00:25.48]爱像是一场小雨\n" +
            "[00:31.32]淅沥沥淅沥沥\n" +
            "[00:33.23]滴入我回忆\n" +
            "[00:39.21]爱又像一场旅行\n" +
            "[00:44.91]走停停走停停\n" +
            "[00:46.87]忽然遇见你\n" +
            "[00:50.33]停下了足迹\n" +
            "[00:54.54]是否还是不太喜欢吃香菜\n" +
            "[00:58.27]到现在都没改\n" +
            "[01:01.4]那双原来最喜欢的匡威鞋带\n" +
            "[01:05.15]现在却解不开\n" +
            "[01:07.32]那张磁带一再一再\n" +
            "[01:10.979996]它又再一次的卡带\n" +
            "[01:14.31]却还会再一遍一遍\n" +
            "[01:17.83]一遍又一遍听下来\n" +
            "[01:21.11]昨天的爱 已回不来\n" +
            "[01:27.99]却依然在心里徘徊\n" +
            "[01:31.35]却依然在心底徘徊\n" +
            "[02:01.41]爱又像一场旅行\n" +
            "[02:07.29]走停停走停停\n" +
            "[02:09.18]忽然遇见你\n" +
            "[02:12.59]停下了足迹\n" +
            "[02:16.7]是否还是不太喜欢吃香菜\n" +
            "[02:20.61]到现在都没改\n" +
            "[02:23.59]那双原来最喜欢的匡威鞋带\n" +
            "[02:27.45]现在却解不开\n" +
            "[02:29.84]那张磁带一再一再\n" +
            "[02:33.23]它又再一次的卡带\n" +
            "[02:36.58]却还会再一遍一遍\n" +
            "[02:40.07]一遍又一遍听下来\n" +
            "[02:43.42]昨天的爱 已回不来\n" +
            "[02:50.29001]却依然在心里徘徊\n" +
            "[02:53.69]却依然在心底徘徊\n" +
            "[02:59.64]凶手和恋人都喜欢事后回现场\n" +
            "[03:06.59]看一看自己从前到底有多疯狂\n" +
            "[03:13.29]回忆里充满着罗曼蒂克的幻想\n" +
            "[03:19.01]那张磁带里藏着过往\n" +
            "[03:22.45]播放了就会回到现场\n" +
            "[03:26.38]再一再它又再一次的卡带\n" +
            "[03:31.38]却还会再一遍一遍\n" +
            "[03:34.95]一遍又一遍听下来\n" +
            "[03:38.31]昨天的爱 已回不来\n" +
            "[03:45.13]却依然在心里徘徊\n" +
            "[03:48.48]却依然在心底徘徊"
    },
    // 牵丝戏
    {
        cover: "https://img2.kuwo.cn/star/albumcover/500/6/48/1406239650.jpg",
        title: "牵丝戏",
        url: music2,
        singer: "银临&Aki阿杰 \n",
        lyric: "[00:00.25]牵丝戏 - 银临/Aki阿杰\n" +
            "[00:02.33]词：Vagary\n" +
            "[00:03.53]曲：银临\n" +
            "[00:24.0]银：\n" +
            "[00:24.42]嘲笑谁恃美扬威\n" +
            "[00:30.16]没了心如何相配\n" +
            "[00:34.97]盘铃声清脆\n" +
            "[00:37.8]帷幕间灯火幽微\n" +
            "[00:40.63]我和你 最天生一对\n" +
            "[00:46.94]没了你才算原罪\n" +
            "[00:52.59]没了心才好相配\n" +
            "[00:57.22]你褴褛我彩绘\n" +
            "[00:59.91]并肩行过山与水\n" +
            "[01:02.8]你憔悴 我替你明媚\n" +
            "[01:08.42]是你吻开笔墨\n" +
            "[01:11.35]染我眼角珠泪\n" +
            "[01:14.07]演离合相遇悲喜为谁\n" +
            "[01:19.68]他们迂回误会\n" +
            "[01:22.47]我却只由你支配\n" +
            "[01:25.11]问世间哪有更完美\n" +
            "[01:30.020004]Aki：\n" +
            "[01:30.39]兰花指捻红尘似水\n" +
            "[01:35.96]三尺红台 万事入歌吹\n" +
            "[01:41.619995]唱别久悲不成悲\n" +
            "[01:44.67]十分红处竟成灰\n" +
            "[01:47.47]愿谁记得谁 最好的年岁\n" +
            "[02:15.68]银：\n" +
            "[02:16.16]你一牵我舞如飞\n" +
            "[02:21.82]你一引我懂进退\n" +
            "[02:26.53]苦乐都跟随\n" +
            "[02:29.31]举手投足不违背\n" +
            "[02:32.01]将谦卑 温柔成绝对\n" +
            "[02:37.83]你错我不肯对\n" +
            "[02:40.47]你懵懂我蒙昧\n" +
            "[02:43.23]心火怎甘心扬汤止沸\n" +
            "[02:48.99]你枯我不曾萎\n" +
            "[02:51.72]你倦我也不敢累\n" +
            "[02:54.32]用什么暖你一千岁\n" +
            "[02:59.37]Aki：\n" +
            "[02:59.64]风雪依稀秋白发尾\n" +
            "[03:05.36]灯火葳蕤 揉皱你眼眉\n" +
            "[03:10.84]假如你舍一滴泪\n" +
            "[03:14.06]假如老去我能陪\n" +
            "[03:16.63]烟波里成灰 也去得完美\n" +
            "[03:22.07]风雪依稀秋白发尾\n" +
            "[03:27.61]灯火葳蕤 揉皱你眼眉\n" +
            "[03:33.13]假如你舍一滴泪\n" +
            "[03:36.32]假如老去我能陪\n" +
            "[03:39.14]烟波里成灰 也去得完美"
    },
    {
        cover: "https://img2.kuwo.cn/star/albumcover/500/39/81/402865218.jpg",
        title: "We Don’t Talk Anymore ",
        singer: "Charlie Puth&Selena Gomez",
        url: music3,
        lyric: "[00:00.10]We Don't Talk Anymore (只剩沉默) - Charlie Puth (查理·普斯)/Selena Gomez (赛琳娜·戈麦斯)\n" +
            "[00:00.15]Written by：Jacob Kasher/Charlie Puth/Hindlin/Selena Gomez\n" +
            "[00:00.86]Charlie Puth：\n" +
            "[00:00.86]We don't talk anymore we don't talk anymore\n" +
            "[00:05.52]只剩沉默 我们之间只剩沉默\n" +
            "[00:05.52]We don't talk anymore like we used to do\n" +
            "[00:10.33]只剩沉默 耳语亲昵已是从前\n" +
            "[00:10.33]We don't love anymore\n" +
            "[00:12.63]爱也在沉默中消耗殆尽\n" +
            "[00:12.63]What was all of it for\n" +
            "[00:14.39]这一切究竟是为何\n" +
            "[00:14.39]Oh we don't talk anymore\n" +
            "[00:16.62]噢 我们不再像从前那样\n" +
            "[00:16.62]Like we used to do\n" +
            "[00:19.83]耳语亲昵已是从前\n" +
            "[00:19.83]I just heard you found the one you've been looking\n" +
            "[00:23.48]听说你已找到了心仪的他\n" +
            "[00:23.48]You've been looking for\n" +
            "[00:25.87]你一直找寻的另一半\n" +
            "[00:25.87]I wish I would have known that wasn't me\n" +
            "[00:29.45]我希望我早能明白你要的不是我\n" +
            "[00:29.45]'Cause even after all this time I still wonder\n" +
            "[00:33.08]因为分开了那么久我却不知为何\n" +
            "[00:33.08]Why I can't move on\n" +
            "[00:35.45]为何我还无法释怀\n" +
            "[00:35.45]Just the way you did so easily\n" +
            "[00:39.43]而不是像你那样轻松放手\n" +
            "[00:39.43]Don't wanna know\n" +
            "[00:41.20]我不想知道\n" +
            "[00:41.20]What kind of dress you're wearing tonight\n" +
            "[00:43.71]今夜你会穿哪一条裙装\n" +
            "[00:43.71]If he's holding onto you so tight\n" +
            "[00:46.22]也不想去想他会否如我从前那般\n" +
            "[00:46.22]The way I did before\n" +
            "[00:49.23]将你紧拥在怀里\n" +
            "[00:49.23]I overdosed\n" +
            "[00:50.90]我沉溺于过去无法自拔\n" +
            "[00:50.90]Should've known your love was a game\n" +
            "[00:53.26]我早该知道你的爱不过是场游戏\n" +
            "[00:53.26]Now I can't get you out of my brain\n" +
            "[00:55.61]而我就是无法将你忘怀\n" +
            "[00:55.61]Oh it's such a shame\n" +
            "[00:58.23]噢 真是无奈\n" +
            "[00:58.23]That we don't talk anymore we don't talk anymore\n" +
            "[01:03.02]只剩沉默 我们之间只剩沉默\n" +
            "[01:03.02]We don't talk anymore like we used to do\n" +
            "[01:07.88]只剩沉默 耳语亲昵已是从前\n" +
            "[01:07.88]We don't love anymore\n" +
            "[01:10.20]爱也在沉默中消耗殆尽\n" +
            "[01:10.20]What was all of it for\n" +
            "[01:11.91]这一切究竟是为何\n" +
            "[01:11.91]Oh we don't talk anymore\n" +
            "[01:14.12]噢 我们不再像从前那样\n" +
            "[01:14.12]Like we used to do\n" +
            "[01:17.30]耳语亲昵已是从前\n" +
            "[01:17.30]Selena Gomez：\n" +
            "[01:17.34]I just hope you're lying next to somebody\n" +
            "[01:20.74]我希望能有人陪在你身边\n" +
            "[01:20.74]Who knows how to love you like me\n" +
            "[01:23.49]他能像我那样好好爱你\n" +
            "[01:23.49]There must be a good reason that you're gone\n" +
            "[01:27.14]你的离开一定有不得已的苦衷\n" +
            "[01:27.14]Every now and then I think you\n" +
            "[01:29.18]而我时常总会想起你\n" +
            "[01:29.18]Might want me to come show up at your door\n" +
            "[01:33.17]或许你会希望我出现在你家门口\n" +
            "[01:33.17]But I'm just too afraid that I'll be wrong\n" +
            "[01:37.10]而我又害怕这只是我的愚蠢想法\n" +
            "[01:37.10]Don't wanna know\n" +
            "[01:38.85]我不想知道\n" +
            "[01:38.85]If you're looking into her eyes\n" +
            "[01:41.26]是否你凝视她的双眸\n" +
            "[01:41.26]If she's holding onto you so tight\n" +
            "[01:43.73]是否她也像我从前那样\n" +
            "[01:43.73]The way I did before\n" +
            "[01:46.57]紧握你的手\n" +
            "[01:46.57]I overdosed\n" +
            "[01:48.46]我沉溺于过去无法自拔\n" +
            "[01:48.46]Should've known your love was a game\n" +
            "[01:50.81]我早该知道你的爱不过是场游戏\n" +
            "[01:50.81]Now I can't get you out of my brain\n" +
            "[01:53.21]而我就是无法将你忘怀\n" +
            "[01:53.21]Oh it's such a shame\n" +
            "[01:55.80]噢 真是无奈\n" +
            "[01:55.80]Both：\n" +
            "[01:55.88]That we don't talk anymore we don't talk anymore\n" +
            "[02:00.65]只剩沉默 我们之间只剩沉默\n" +
            "[02:00.65]We don't talk anymore like we used to do\n" +
            "[02:05.48]只剩沉默 耳语亲昵已是从前\n" +
            "[02:05.48]We don't love anymore\n" +
            "[02:07.81]爱也在沉默中消耗殆尽\n" +
            "[02:07.81]What was all of it for\n" +
            "[02:09.46]这一切究竟是为何\n" +
            "[02:09.46]Oh we don't talk anymore\n" +
            "[02:11.75]噢 我们不再像从前那样\n" +
            "[02:11.75]Like we used to do\n" +
            "[02:24.00]耳语亲昵已是从前\n" +
            "[02:24.00]Charlie Puth：\n" +
            "[02:24.04]Like we used to do\n" +
            "[02:34.79]我们不再像从前那样\n" +
            "[02:34.79]Don't wanna know\n" +
            "[02:36.35]我不想知道\n" +
            "[02:36.35]What kind of dress you're wearing tonight\n" +
            "[02:38.72]今夜你会穿哪一条裙装\n" +
            "[02:38.72]If he's giving it to you just right\n" +
            "[02:41.23]是否他像我那样\n" +
            "[02:41.23]The way I did before\n" +
            "[02:44.10]将一切全都给你\n" +
            "[02:44.10]Selena Gomez：\n" +
            "[02:44.13]I overdosed\n" +
            "[02:46.05]我沉溺于过去无法自拔\n" +
            "[02:46.05]Should've known your love was a game\n" +
            "[02:48.40]我早该知道你的爱不过是场游戏\n" +
            "[02:48.40]Now I can't get you out of my brain\n" +
            "[02:50.80]而我就是无法将你忘怀\n" +
            "[02:50.80]Charlie Puth：\n" +
            "[02:50.84]Oh it's such a shame\n" +
            "[02:53.40]噢 真是无奈\n" +
            "[02:53.40]Both：\n" +
            "[02:53.47]That we don't talk anymore we don't talk anymore\n" +
            "[02:58.23]只剩沉默 我们之间只剩沉默\n" +
            "[02:58.23]We don't talk anymore like we used to do\n" +
            "[03:03.09]只剩沉默 耳语亲昵已是从前\n" +
            "[03:03.09]We don't love anymore\n" +
            "[03:05.45]爱也在沉默中消耗殆尽\n" +
            "[03:05.45]What was all of it for\n" +
            "[03:07.02]这一切究竟是为何\n" +
            "[03:07.02]Oh we don't talk anymore\n" +
            "[03:09.37]噢 我们不再像从前那样\n" +
            "[03:09.37]Like we used to do\n" +
            "[03:12.67]耳语亲昵已是从前\n" +
            "[03:12.67]We don't talk anymore\n" +
            "[03:14.29]只剩沉默 我们之间只剩沉默\n" +
            "[03:14.29]What kind of dress you're wearing tonight\n" +
            "[03:17.23]今夜你会穿哪一条裙装\n" +
            "[03:17.23]If he's holding onto you so tight\n" +
            "[03:19.61]是否他也像我之前那样\n" +
            "[03:19.61]The way I did before\n" +
            "[03:22.47]紧握住你不放手\n" +
            "[03:22.47]We don't talk anymore\n" +
            "[03:24.11]只剩沉默 我们之间只剩沉默\n" +
            "[03:24.11]Should've known your love was a game\n" +
            "[03:26.83]我早该知道你的爱不过是场游戏\n" +
            "[03:26.83]Now I can't get you out of my brain\n" +
            "[03:29.18]而我就是无法将你忘怀\n" +
            "[03:29.18]Oh it's such a shame\n" +
            "[03:31.61]噢 真是无奈\n" +
            "[03:31.61]That we don't talk anymore\n" +
            "[03:36.061]只剩沉默 我们之间只剩沉默"
    }

]

export default musicList
## vlc media player

### 基本使用

``` new Player(Path,Options,Callback) ```
```
let Vlcplayer = require('./vlc-player.js').Player;
new Vlcplayer('./1.mp4',{
 	width:800,
 	repeat:false
},(player)=>{
 	player.play();
});
```

* Path: String|Array

* Options: Object

* Callback: Function

### 参数
传递给VLC的参数,默认的参数以及传输的格式：
```
{
	'intf':'rc',
	'verbose':3,
	'config':'blank',
	'one-instance':true,
	'ignore-config':true,
	'rc-quiet':true,
	'no-crashdump':true,
	'no-media-library':true,
	'no-plugins-cache':true,
	'no-embedded-video':true,
	'no-snapshot-preview':true,
	'no-video-deco':true,
	'no-video-title-show':true,
	'video-on-top':false,
	'video-x':-1,
	'video-y':-1	
}
```

### 方法
封装好了几个简单的常用的方法

| 方法  | 描述  |
| :----- | :----- |
| destory()      | 销毁VLC客户端 |
| play()         | 播放视频 |
| clear()        | 清除播放列表 |
| repeat(argv)   | 重复视频，argv可以是'on'或'off' |
| pause()        | 暂停播放 |
| stop()         | 停止播放 |
| next()         | 播放列表下一个 |
| prev()         | 播放列表上一个 |
| loop(argv)     | 循环播放列表，argv可以是'on'或'off' |

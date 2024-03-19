let Vlcplayer = require('./vlc-player.js').Player;
new Vlcplayer('stream.m3u8',{
	width:800,
	repeat:false
},(player)=>{
	player.play();
});

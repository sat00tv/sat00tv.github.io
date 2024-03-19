let Vlcplayer = require('./vlc-player.js').Player;
new Vlcplayer('http://connectiktv.ddns.net:5000/mytvchannel/@mytvchannel/playlist.m3u8',{
	width:800,
	repeat:false
},(player)=>{
	player.play();
});

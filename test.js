let Vlcplayer = require('./vlc-player.js').Player;
new Vlcplayer('./1.mp4',{
	width:800,
	repeat:false
},(player)=>{
	player.play();
});

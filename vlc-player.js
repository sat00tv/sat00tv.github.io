'use strict';

const fs      = require('fs');
const net     = require('net');
const http    = require('http');
const path    = require('path');
const spawn   = require('child_process').spawn;

const vlc_path = path.join(__dirname, "vlc/vlc.exe");

// vlc 客户端创建
const player = function() {
 	return spawn.bind(null, vlc_path).apply(null, arguments,{stdio : ['ignore', 'ignore', 'pipe']});
}

// 随机端口号
let randomport = async () => {
	return new Promise((resolve)=>{
		let server  = http.createServer().listen(0,function(){
			resolve(server.address().port);
			server.close();
		});		
	})
}

// 连接 telnet
let connectTelnet = async (port) => {
	let n = 0;
	let sock = null;

	return new Promise((resolve,reject)=>{
		sock = net.connect({host:'127.0.0.1',port:port},function(){

			sock.setNoDelay();

			// 接受数据
			sock.on('data',function(data){
				console.log('Get data: ',data.toString());
			});

			// 断开连接回调
			sock.once('end',function(){
				sock = null;
			});

			sock.once('error',function(err){
				console.log(err);
			});

			resolve(sock);

		});

		sock.on('error',function(err){
			n++;
			if(n >= 100){
				sock.end();
				reject(err);
			}
		});
	})	
}

// 默认参数
const default_player_options = {
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

class Vlcplayer{
	constructor(path,options,cb){
		this.path = path;
		this.cmdOptions = [];
		this.options = Object.assign({},default_player_options,options || {});
		// 处理外部传来的参数
		Object.keys(this.options).map((key)=>{
			if(this.options[key]){
				if(typeof this.options[key] === 'boolean'){
					this.cmdOptions.push('--'+key);
				}else{
					this.cmdOptions.push('--'+key+'='+this.options[key])
				}
			}
		});

		// 初始化播放器客户端
		let init = async()=>{
			// 创建随机端口号
			this.port = await randomport();
			// 补充参数
			this.cmdOptions.push('--rc-host=127.0.0.1:'+this.port);
			// 创建vlc客户端
			this.vlcplayer = player(this.cmdOptions);
			// 创建socket连接
			this.sock = await connectTelnet(this.port);

			this.vlcplayer.stderr.on('data', function (s) {
				// console.log('VlC Player Dump Info: ',s.toString());
			});

			this.vlcplayer.on('close',function(){
				this.destory();
				console.log('VlC Player Is Closed!');
			});

			this.vlcplayer.on('error',function(err){
				this.destory();
				console.log('VlC Player Error: ',err);
			});

			cb && cb(this);
		}

		init();
				
	}

	destory(){
		this.vlcplayer && this.vlcplayer.kill();
		this.sock && this.sock.end();
	}

	play(){
		if(this.path && this.sock){
			if(Array.isArray(this.path)){
				this.sock.write('clear\r\n');
				this.path.map((path)=>{
					if(fs.existsSync(this.path)){
						this.sock.write('add '+this.path+'\r\n');
					}
				})
			}else{
				if(fs.existsSync(this.path)){
					this.sock.write('clear\r\nadd '+this.path+'\r\n');
				}				
			}
			
		}else{
			console.log('Use Error : Path is wrong or socket connect failed!');
		}
	}

	clear(){
		if(this.sock){
			this.sock.write('clear\r\n');
		}
	}

	repeat(argv){
		if(this.sock && argv){
			this.sock.write('repeat '+argv+'\r\n');
		}		
	}

	pause(){
		if(this.sock){
			this.sock.write('pause\r\n');
		}
	}

	stop(){
		if(this.sock){
			this.sock.write('stop\r\n');
		}
	}

	next(){
		if(this.sock){
			this.sock.write('next\r\n');
		}
	}

	prev(){
		if(this.sock){
			this.sock.write('prev\r\n');
		}
	}

	loop(argv){
		if(this.sock && argv){
			this.sock.write('loop '+argv+'\r\n');
		}		
	}	
}

module.exports.Player = Vlcplayer;

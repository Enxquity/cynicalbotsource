const TOKEN = "NDg1ODQ4MzI1MDc0MTkwMzU5.DoqN6Q.gx9JDDeaNWZZMQOBpWX6B2NTAzE"
const Discord = require("discord.js");
const bot = new Discord.Client();
const PREFIX = "?";
const fs = require("fs");
const glob = require("glob");
const ms = require("ms");
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube('AIzaSyCzt6G9v3trqAwlckQpEMr8x6pQ_N6_rMw');
const queue = new Map();
var opusscript = require("opusscript");
const ffmpeg = require('ffmpeg');
const client = new Discord.Client({
    //Disable Bot to @everyone
    disableEveryone: true,
    //"Auto reconnect"
    autoReconnect: true
});


bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();



bot.on("ready", async => {
  console.log("Online");
})

bot.on("guildMemberAdd", function(member) {
  member.addRole(member.guild.roles.find("name", "Unregistered"));
})

bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;

  if (!message.content.startsWith(PREFIX)) return;

  var args = message.content.substring(PREFIX.length).split(" ");

  switch (args[0].toLowerCase()) {
	case "hello":
		 if(message.channel.id !== '500807272713158666') return message.reply("Wrong channel, please use commands in #bot-commands");
	message.channel.send("WHO FUCKING SAID HELLO, WHOEVER YOU ARE SHOW YOURSELF I WILL FUCKING KILL YOU NIGGA");
	break
    case "ping":
		 if(message.channel.id !== '500807272713158666') return message.reply("Wrong channel, please use commands in #bot-commands");
    message.channel.send("Pong nigga");
    break
    case "sendverification":
    if (message.channel.id !== '485845355582324757') return message.channel.send("Wrong channel... || ERROR : Already Verified");
    message.channel.send("Processing request. Please wait while one of the staff accept...");
    let verichan = message.member.guild.channels.find("name", "manual-verification")
    var embed = new Discord.RichEmbed()
    .addField(`Sent Verification, from ${message.member.user}`, "Accept or block?")
    .setThumbnail(message.author.avatarURL)
    verichan.sendEmbed(embed);
    verichan.send("@everyone @here new request");
    break
    case "accept":
		
    if(!message.member.hasPermission(`ADMINISTRATOR`)) return message.channel.send("Your not a admin, you thought you could trick me :)");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) return message.channel.send('Please mention a user.');
    let gRole = message.guild.roles.find("name", "Registered");
    let rRole = message.guild.roles.find("name", "Unregistered")
    member.addRole(gRole.id);
    member.removeRole(rRole.id);
    if(member.roles.has(gRole.id)) return message.channel.send(`${member.user} is already verified!`);
    message.channel.send(`I sent a dm to ${member.user} letting him know that his request was accepted!`);
    member.send("Your request was accepted!");
    break
    case "block":
		 if(message.channel.id !== '500807272713158666') return message.reply("Wrong channel, please use commands in #bot-commands");
    if(!message.member.hasPermission(`ADMINISTRATOR`)) return message.channel.send("Your not a admin, you thought you could trick me :)");
    let plr = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!plr) return message.channel.send('Please mention a user.');
    let brole = message.guild.roles.find("name", "Verification Declined");
    plr.addRole(brole.id);
    plr.send("Your Verification was declined!");
    break

	case "mute":
		if(message.channel.id !== '500807272713158666' && message.member.hasPermission("ADMINISTRATOR")) return message.reply("Wrong channel, please use commands in #bot-commands");
	if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You do not have administrator;therefore, you will not be able to use this command.");
	let muteMember = message.mentions.members.first();
	if(!muteMember) return message.reply("No user was found, please try again {USAGE {?mute @member {time}}");
	if(muteMember.hasPermission("ADMINISTRATOR")) return message.reply("The user you have tried to mute is a administrator and cannot be muted.")
	let muteRole = message.guild.roles.find("name", "Muted");
	if(!muteRole) return message.reply("The role named 'Muted' was undefined, Please create the role and try again.");
	let params =  message.content.split(" ").slice(1);
	let time = params[1];
	if (!time) return message.reply(`***${message.content}***, Incorrect usage. Missing time {USAGE {?mute @member {time}}`);
	
	muteMember.addRole(muteRole.id);
	message.channel.send(`Oh no, You have been muted for ${ms(ms(time), {long:true})} ${muteMember.user.tag}`);
	
	setTimeout(function() {
		muteMember.removeRole(muteRole.id);
		message.channel.send(`${muteMember.user.tag}, You have been unmuted, the mute lasted : ${ms(ms(time), {long:true})}`)
	}, ms(time));
	break
	case "banappeal":

    let sliceddmessage = message.content.slice(10);
    let aretRole = message.guild.roles.find("name", "Appeal Sent");
    if(message.channel.id !== '500764606432673803') return message.reply("Wrong channel, make sure to appeal in #ban-appeals unless your not banned!"); 
    message.member.addRole(aretRole.id);
    if(!sliceddmessage) return message.reply("Please provide a reason");
    if(sliceddmessage) { 
    let appealchan = message.member.guild.channels.find("name", "appeal-requests")
    appealchan.send(`${message.member.user} Has made an appeal saying : ${sliceddmessage}`);
    }
    break
	case "ban":
    if(message.channel.id !== '500807272713158666') return message.reply("Wrong channel, please use commands in #bot-commands");
	if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You do not have administrator;therefore, you will not be able to use this command.");
	let banMember = message.mentions.members.first();
	if(!banMember) return message.reply("Please provide a user to ban. {USAGE : ?ban @member}");
	if(banMember.hasPermission("ADMINISTRATOR")) return message.reply("The user you have provided is a administrator, please try again.");
	let banRole = message.guild.roles.find("name", "Banned");
	if(!banRole)return message.reply("You do not have a role named 'Banned', create this role and try again.");
	
	banMember.addRole(banRole.id);
	message.channel.send(`Woop, Guess ${banMember.user.tag} was banned Permantly, Unless he makes an appeal.`);
	break
	
    case "appeal":
    let slicedmessage = message.content.slice(7);
    let aRole = message.guild.roles.find("name", "Appeal Sent");
    if(message.channel.id !== '495568708228349952') return message.reply("Wrong channel, make sure to appeal in #ban-appeals unless your not banned!"); 
    message.member.addRole(aRole.id);
    if(!slicedmessage) return message.reply("Please provide a reason");
    if(slicedmessage) { 
    let appealchan = message.member.guild.channels.find("name", "appeal-requests")
    appealchan.send(`${message.member.user} Has made an appeal saying : ${slicedmessage}`);
    }
    break
  
	case "acceptappeal":
	let appealMember = message.mentions.members.first();
    let bRole = message.guild.roles.find("name", "Banned");
	if(!appealMember.roles.has(bRole.id)) return message.reply("This user is not banned.");
	if(!appealMember) return message.reply("Please provide a user!");
	let acrRole = message.guild.roles.find("name", "Appeal Sent");
	
	appealMember.removeRole(acrRole.id);
	appealMember.removeRole(bRole.id);
	message.channel.send(`I have sent a dm to ${appealMember} telling him he was unbanned.`);
	appealMember.send("Your appeal was accepted;therefore, you were unbanned.");
	break
	case "unmute":
		 if(message.channel.id !== '500807272713158666') return message.reply("Wrong channel, please use commands in #bot-commands");
	if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Your are not a administrator.");
    let uUser = message.mentions.members.first();
	if(!uUser) return message.reply("Provide a user.");
	let mRole = message.guild.roles.find("name", "Muted");
	if(uUser.roles.has(mRole.id)) {
		uUser.removeRole(mRole.id);
		message.channel.send(`:white_check_mark: ${uUser.user.tag}, Was successfully unmuted! :white_check_mark: `);
	}
	else {
		message.reply("The uesr provided is not muted.");
	}
	break
  }
})

glob('cmds/**/*.js', (err, files) => {
    if (err) console.log(err);
		files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./` + file);
		let commandName = file.split(".")[0]
	  bot.commands.set(props.help.name, props);
	  props.help.aliases.forEach(alias => {
	      bot.aliases.set(alias, props.help.name);
	  });
    });
});
var owner = '398559841020411904'
var prefix = '?'
var servers = {};
bot.on("message", async(message) => {
    if (message.channel.type === "dm") {
        if (message.author.bot) return;

        message.react("❌")

        message.author.send("You Cannot Use Music Commands In DM")

        return;
    }
    var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
  var searchString = args.slice(1).join(' ');
	var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	var serverQueue = queue.get(message.guild.id);
    switch (args[0].toLowerCase()) {
      case "play":
    var voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		var permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			var playlist = await youtube.getPlaylist(url);
			var videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				var video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					var index = 0;
					message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						return message.channel.send('No or invalid value entered, cancelling video selection.');
					}
					var videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					return message.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
        break;
      case "skip":
	   message.channel.send("We Are Currently having Issues with this command, we hope to have it fixed soon!")
		//if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		//if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
		//serverQueue.connection.dispatcher.end();('Skip command has been used!');
		//return undefined;
        break;
      case "stop":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
break;
	  case "volume":
	  if (message.author.id !== owner) return message.channel.send("command removed due to Sound Problems! Only Bot Owner Can Use The Command!")
	  if (message.author.id === owner) {
	  if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
	  if (!serverQueue) return message.channel.send('There is nothing playing.');
	  if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
	  serverQueue.volume = args[1];
	  serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
	  return message.channel.send(`I set the volume to: **${args[1]}**`);
	  }
break;
		 
	
break;
      case "playing":
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
break;
      case "queue":
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
break;
      case "pause":
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
		}
		return message.channel.send('There is nothing playing.');
break;
      case "resume":
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
		}
		return message.channel.send('There is nothing playing.');
	

	return undefined;
break;
}
async function handleVideo(video, message, voiceChannel, playlist = false) {
	var serverQueue = queue.get(message.guild.id);
	var song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		var queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}
  function play(guild, song) {
	var serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.')
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
  }
})
bot.login(TOKEN);
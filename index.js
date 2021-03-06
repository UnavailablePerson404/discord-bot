const emojiRegex = require('emoji-regex');

const Discord = require('discord.js');

const bot = new Discord.Client();

bot.on('ready', () => {
	console.log('The bot is ready!'); // Log "Ready!"
});

function TagUser(id) {
	return '<@' + id + '>';
}

async function report(command, text, msg) {
	if (command === 'new') {
		if (msg.channel.id !== '734889114607943811') {
			msg.channel.send(
				':x:, For creating reports please use <#734889114607943811>'
			);
			return;
		}
		const ch = msg.guild.channels.cache.find(
			channel => channel.name === 'report-' + msg.member.id
		);
		if (ch === undefined) {
			await msg.guild.channels
				.create('report-' + msg.member.id)
				.then(channel => channel.setParent('734888984592777306'))
				.then(channel =>
					channel.overwritePermissions([
						{
							id: msg.guild.id,
							deny: ['VIEW_CHANNEL']
						},
						{
							id: msg.member.id,
							allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
						}
					])
				)
				.then(channel =>
					channel.send(
						`CREATED BY: ${TagUser(msg.member.id)}
REASON: ` + text
					)
				);
		} else {
			msg.channel.send(
				`${TagUser(msg.member.id)}, You already have a report which is ${'<#' +
					ch.id +
					'>'}, please say what you want there and close it to make a new report`
			);
		}
	} else if (command === 'close') {
		if (
			(msg.channel.name.includes(msg.member.id) ||
				msg.member.hasPermission('ADMINISTRATOR')) &&
			msg.channel.name.startsWith('report-')
		) {
			msg.channel.delete();
		}
	}
}

let hash_map = new Map();

let hash_map2 = new Map();

let spam_msgs = new Map();

let UserIsNotInWarning = new Map();

bot.on('message', async msg => {
	// When a message is created
	if (msg.member.id == '733772882966216865') return;

	if (msg.channel.id == '712397815506272287') {
		if (msg.attachments.size > 0) {
			msg.react('719626360934629447');
		}
	}
	if (
		msg.content.toLowerCase() == '?about' ||
		(msg.content.toLowerCase().includes('what') &&
			msg.content.toLowerCase().includes('this') &&
			msg.content.toLowerCase().includes('server'))
	) {
		await msg.member
			.send(
				`some message`
			)
			.catch(err => console.error(err));
		await msg.channel
			.send(
				`${TagUser(
					msg.member.id
				)} Check your Direct Messages, If you didn't get a message make sure you have Direct Messages from members of this server enabled`
			)
			.catch(err => console.error(err));
	}

	const mg_low = msg.content.toLowerCase();
	for(i = 0; i < msg.content.length; i++)
	{
		if(msg.content.split(mg_low.charAt(i)).length >= 75)
		{
			if(UserIsNotInWarning.has(msg.member.id))
			{
			 UserIsNotInWarning.set(msg.member.id, UserIsNotInWarning.get(msg.member.id)+1);
			 setTimeout(function(){UserIsNotInWarning.delete(msg.member.id);}, 2000);
			}
			else
			{
				UserIsNotInWarning.set(msg.member.id, 1);
			}
			break;
		}
	}

	hash_map2.set(msg.member.id, false);
	if (!hash_map.has(msg.member.id)) {
		spam_msgs.set(msg.member.id, [msg]);
	} else {
		spam_msgs.get(msg.member.id).push(msg);
	}
	setTimeout(function() {
		hash_map2.set(msg.member.id, true);
		hash_map.set(msg.member.id, 0);
		spam_msgs.set(msg.member.id, []);
	}, 5000);

	hash_map.set(
		msg.member.id,
		(function() {
			if (hash_map.has(msg.member.id)) {
				return hash_map.get(msg.member.id) + 1;
			} else {
				return 1;
			}
		})()
	);

	if ((hash_map.get(msg.member.id) >= 5 && !hash_map2.get(msg.member.id)) || UserIsNotInWarning.get(msg.member.id) >= 3) {
		msg.member.roles.remove('706590856668381285');
		msg.member.roles.add('733850071468343297');
		spam_msgs.forEach( msg => msg.delete() );
		await msg.channel
			.send(
				`${TagUser(msg.member.id)} Has been muted for 15 minutes for spamming.`
			)
			.catch(err => console.error(err));
		setTimeout(function() {
			msg.member.roles.remove('733850071468343297');
			msg.member.roles.add('706590856668381285');
		}, 900000);
		hash_map.delete(msg.member.id);
		hash_map2.delete(msg.member.id);
		spam_msgs.delete(msg.member.id);
	}
	// detecting emoji spam
	const regex = emojiRegex();
	let arr = msg.content.match(/<:.+?:\d+>/g);

	let array1;
	let arr2 = [];

	while ((array1 = regex.exec(msg.content)) !== null) {
		arr2.push(array1[0]);
	}
	if (arr === null) arr = [];

	if (arr.length + arr2.length > 6) {
		await msg.channel
			.send(
				`There are too many emojis in your message, ${TagUser(msg.member.id)}!`
			)
			.catch(err => console.error(err));
		msg.delete();
	}
	// end of detecting emoji spam

	//start of calling report
	if (msg.content.startsWith('?report')) {
		let arr = msg.content.split(' ');
		if (arr === null) {
			msg.channel.send(':x: 2 arguments were expected');
			return;
		}
		let result_str = arr[2];
		if (arr.length > 2)
			for (i = 3; i < arr.length; i++) {
				result_str += ' ' + arr[i];
			}
		await report(arr[1], result_str, msg).catch(err => console.error(err));
	}
	//end of calling report

	const msg_lowercase = msg.content.toLowerCase();
	if ((
		msg.content.toLowerCase().includes('fuck') ||
		msg.content.toLowerCase().includes('nigg') ||
		msg_lowercase.includes('asshole') ||
		msg_lowercase.includes('pussy') ||
		msg_lowercase.includes(' arse') ||
		msg_lowercase.includes('arse ') ||
		msg_lowercase.includes(' kys') ||
		msg_lowercase == 'kys' ||
		msg_lowercase.includes('kys ') ||
		msg_lowercase.startsWith('arse') ||
		msg_lowercase.includes('dumbass') ||
		msg_lowercase.includes(' cock') ||
		msg_lowercase.includes('cock ') ||
		msg_lowercase === 'cock' ||
		((msg_lowercase.includes(' dick') || msg_lowercase.includes('dick ')) &&
			(msg_lowercase.includes(' suck') || msg_lowercase.includes('suck '))) ||
		(msg_lowercase.includes('👉') && msg_lowercase.includes('👌')) ||
		msg_lowercase.includes(' bitch') ||
		msg_lowercase.includes('bitch ')
	)) {
		await msg.channel
			.send(
				`We do not tolerate these kinds of words ${TagUser(
					msg.member.id
				)}. please don't use them again.`
			)
			.catch(err => console.error(err));
		msg.delete();
	}
	if (msg.content == '?hello') {
		await msg.channel
			.send(`Hello, ${TagUser(msg.member.user.id)}!`)
			.catch(err => console.error(err));
	}
	if (msg.content == '?botstat') {
		await msg.channel
			.send(':white_check_mark: Bot is up and running.')
			.catch(err => console.error(err));
	}
	if (
		msg.content.startsWith('?eval') &&
		msg.member.id === '410875571493535764'
	) {
		let result_str = '';
		for (i = 6; i < msg.content.length; i++) {
			result_str += msg.content[i];
		}
		eval(result_str).catch(err => console.error(err));
		msg.delete();
	}
});
let sent = false;
bot.on('messageReactionAdd', (reaction, user) => {
	let limit = 6;
	if (
		reaction.message.channel.id == '712397815506272287' &&
		reaction.emoji.name == 'some_name' &&
		reaction.count == limit && 
                !sent
	) {
	   bot.channels.fetch('736083047257997342').then(channel => channel.send(TagUser(reaction.message.member.id), reaction.message.attachments.array()[0]));
	   sent = true;
	}
});

bot.on('guildMemberAdd', member => {
	member.roles.add('706590856668381285');
});

bot.on('messageDelete', msg => {
	const channel = bot.channels.cache.get('734173675137531906');
	channel.send(
		'**DETAILS FOR THE MESSAGE SENT BY THE USER WITH ID ' +
			msg.member.id +
			':**\n' +
			'`Message Sent by: ' +
			TagUser(msg.member.id) +
			'`\n' +
			'`Date sent: ' +
			msg.createdAt.toString() +
			'`\n' +
			'`CHANNEL SENT: ' +
			msg.channel.id +
			'`\n' +
			'`MESSAGE CONTENT: `' +
			' ```' +
			msg.content +
			'```'
	);
});

bot.login(process.env.TOKEN); // Get the bot to connect to Discord

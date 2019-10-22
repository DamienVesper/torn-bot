const Discord = require(`discord.js`);
const { config } = require(`../index.js`);
const axios = require(`axios`);
const webRequest = require(`request`);


module.exports.run = async(client, message, args) => {
	let tornUser = args.join(` `);
	webRequest(`https://torn.space/leaderboard/`, (err, res, body) => {
		if(!err) {
			let tableInfo = body.split(`</tr>`);
			var tableData = [];

			for(let i = 1; i < tableInfo.length - 1; i++) {
				tableData.push(tableInfo[i].split(`</th>`));
			}

			var rawTornUsers = {};
			for(let i = 0; i < tableData.length; i++) {
				let newRawTornUser = tableData[i].slice(`,`);
				rawTornUsers[`account${i}`] = newRawTornUser;
			}

			var tornUsers = {};
			for(let i = 0; i < tableData.length; i++) {

				//Init User Vars
				let currentUser = `${rawTornUsers[`account${i}`][1].slice(4)}`;
				let oldUser = rawTornUsers[`account${i}`];
				tornUsers[currentUser] = {};

				//Get User Stats
				tornUsers[currentUser].position = parseInt(`${oldUser[0].slice(28, rawTornUsers[`account${i}`][0].length - 1)}`);
				tornUsers[currentUser].rank = parseInt(`${oldUser[3].slice(4)}`);
				tornUsers[currentUser].xp = parseInt(`${oldUser[2].slice(4)}`);
				tornUsers[currentUser].kills = parseInt(`${oldUser[4].slice(4)}`);
			//	tornUsers[currentUser].accountType = oldUser[5];

				//Determine User's Side
				if(oldUser[0].slice(17, 21) == `cyan`) tornUsers[currentUser].side = `Human`;
				else if(oldUser[0].slice(17, 21) == `pink`) tornUsers[currentUser].side = `Alien`;
				else if(oldUser[0].slice(17, 21) == `lime`) tornUsers[currentUser].side = `Moderation`;
				else console.log(`Could not determine user's team side! ${oldUser}`);
			}
		}
		else console.log(err);
	let tornUserObj = tornUsers[tornUser];
	if(!tornUserObj) return message.channel.send(`${message.author} That user is either not ranked yet or doesn't exist!`);
	
	let sEmbed = new Discord.RichEmbed()
	.setTitle(`Player Info | ${tornUser}`)
	.addField(`Placement`, tornUserObj.position, true)
	.addField(`Side`, tornUserObj.side, true)
	.addField(`Rank`, tornUserObj.rank, true)
	.addBlankField()
	.addField(`Experience`, tornUserObj.xp, true)
	.addField(`Kills`, tornUserObj.kills, true)
	//.addField(`Account Type`. tornUserObj.accountType, true)
	.setTimestamp(new Date())
	.setFooter(config.footer);
	message.channel.send(sEmbed);
	});
}

module.exports.config = {
  name: `search`
}
const Discord = require(`discord.js`);
const User = require(`../models/user.model`);
const {
    config
} = require(`../index.js`);

module.exports = {
    name: `forcereg`,
    description: `meh`,
    usage: null
};

module.exports.run = async (client, message, args) => {
    const tornUsers = await require(`../api.js`);

    if (message.author.id != config.developerID) return message.channel.send(`${message.author} You are not phry's brother.`);
    message.guild.members.forEach(member => {
        const tornUser = member.displayName.toLowerCase();

        const dbUser = User.findOne({
            discordID: member.user.id
        });
        if (!dbUser) return console.error(`[${member.user.id}] You don't have an account yet!`);

        const tornUserObj = tornUsers[dbUser.accountName];
        if (!tornUserObj) return console.log(`${member.user.id} is either not ranked yet or doesn't exist!`);

        const placementRoles = [`453678967996678145`, `453678938275708960`, `453678890628546560`, `453678855534804992`, `453612904365948929`, `453620521632923660`, `453620581041045555`, `453620631116709888`, `453620675526000674`, `453620720581214208`];
        const teamRoles = [`513781861542002690`, `524288679473184806`, `633664409528565798`];
        const accountRoles = [`Player`, `488384379828043796`, `593291717394825218`, `Owner`];

        try {
            member.roles.forEach(role => (placementRoles.includes(role.id) || teamRoles.includes(role.id) || accountRoles.includes(role.id)) ? member.removeRole(role.id) : null);

            if (tornUserObj.placement <= 5) member.addRole(placementRoles[9]);
            else if (tornUserObj.placement <= 10) member.addRole(placementRoles[8]);
            else if (tornUserObj.placement <= 25) member.addRole(placementRoles[7]);
            else if (tornUserObj.placement <= 50) member.addRole(placementRoles[6]);
            else if (tornUserObj.placement <= 75) member.addRole(placementRoles[5]);
            else if (tornUserObj.placement <= 100) member.addRole(placementRoles[4]);
            else if (tornUserObj.placement <= 250) member.addRole(placementRoles[3]);
            else if (tornUserObj.placement <= 500) member.addRole(placementRoles[2]);
            else if (tornUserObj.placement <= 750) member.addRole(placementRoles[1]);
            else if (tornUserObj.placement <= 1000) member.addRole(placementRoles[0]);

            if (tornUserObj.team == `Human`) member.addRole(teamRoles[0]);
            else if (tornUserObj.team == `Alien`) member.addRole(teamRoles[1]);
            else member.addRole(teamRoles[2]);

            if (tornUserObj.accountType == `Player`) {} // member.addRole(accountRoles[0]);
            else if (tornUserObj.accountType == `VIP`) member.addRole(accountRoles[1]);
            else if (tornUserObj.accountType == `Moderator`) member.addRole(accountRoles[2]);
            // else if(tornUserObj.accountType == `Administrator`) member.addRole(accountRoles[3]);
            // else member.addRole(accountRoles[3]);
        } catch (err) {
            console.error(err);
        }
    });
    message.channel.send(`Scanning members now...`);
};
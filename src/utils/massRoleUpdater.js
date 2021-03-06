const User = require(`../models/user.model.js`);

const updateRoles = require(`./updateRoles.js`);
const getTornUsers = require(`./getTornUsers.js`);
const log = require(`./log.js`);

module.exports = async client => {
    const tornUsers = await getTornUsers();
    log(`cyan`, `Automatically updating roles for all users...`);

    let updateUserCount = 0;

    const dbUsers = await User.find({});
    dbUsers.forEach((dbUser, i) => {
        setTimeout(() => {
            const discordMember = client.guilds.get(`247490958374076416`).members.get(dbUser.discordID);
            const tornUser = tornUsers.find(user => user.username === dbUser.accountName);

            if (!discordMember || !tornUser) dbUser.delete();
            else {
                updateRoles(client, discordMember, dbUser.accountName, tornUsers);
                updateUserCount++;
            }
        }, 75e2 * i);
    });

    setTimeout(() => {
        log(`blue`, `Updated roles for ${updateUserCount} users...`);
    }, (dbUsers.length + 1) * 75e2);
};

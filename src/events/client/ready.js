module.exports = {
    name: 'ready',
    once: 'true',
    async execute(client) {
        // 10 * 1000 because it is done in miliseconds
        setInterval(client.pickPresence, 60 * 1000);
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};
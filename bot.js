const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
//ADICIONE UM 8 NO ARQUIVO CONFIG.JSON NO FIM DO TOKEN PARA FUNCIONAR
client.on("ready", () => {
    console.log(`Bot foi iniciado`);
    client.user.setGame(`XanFrango`);
})

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if (comando === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }
    if (comando === "ajuda" || comando === "help") {
        message.channel.send(` Nossos comandos são: "!ping", "!dado" `)
    }

    try {
        if (comando === "dado" || comando === "roll") {
            const valor = message.content.substr(5);
            const total = Math.floor(Math.random() * valor);
            if(!isNaN(total)){
                message.channel.send(` O valor do dado foi -> ${valor} com o total de ->  ${total}`);
            }
            else{
                error;
            }
        }
    } catch (error) {
        message.channel.send(`Repita o comando de forma certa -> "!dado x" usando apenas valores númericos`);
    }

});

client.login(config.token);
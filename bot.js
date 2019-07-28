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
    const idCliente = message.author.id;
    const adsumus = config.adsumus == idCliente;

    if (comando === "ping") {
        let m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }
    if (comando === "ajuda" || comando === "help") {
        message.channel.send(` Nossos comandos são: "!ping", "!dado" `)
    }

    try {
        // if (!adsumus && comando === "dado" || comando === "roll") {
        if (comando === "dado" || comando === "roll") {

            let valor = message.content.substr(5);
            let rolagem = valor.split('d');
            let total;
            if(rolagem.length == 2){
                let count = 0;
                let valorAntigo = 0;
                while(count < rolagem[0]){
                    
                    total = valorAntigo + Math.floor(Math.random() * rolagem[1] ) + 1;
                    valorAntigo = total; 
                    count ++;
                    console.log(valorAntigo);
                }
            }
            else{
                total = Math.floor(Math.random() * valor) + 1;
            }
            if (!isNaN(total)) {
                message.channel.send(` O valor do dado foi -> ${valor} com o total de ->  ${total}`);
            }
            else {
                error;
            }
        }
        // else if(adsumus){
        //     let valor = message.content.substr(5);
        //     message.channel.send(` O valor do dado foi -> ${valor} com o total de ->  ${valor}`);
        // }
    } catch (error) {
        message.channel.send(`Repita o comando de forma certa -> "!dado x" usando apenas valores númericos`);
    }

});

client.login(config.token);
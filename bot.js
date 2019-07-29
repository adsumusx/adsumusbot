const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const firebase = require("firebase");
//ADICIONE UM 8 NO ARQUIVO CONFIG.JSON NO FIM DO TOKEN PARA FUNCIONAR

//Configurações do firebase-
var configBase = {
    apiKey: "AIzaSyA0gYRZa9J3dj1pcoJq2posSOSs6WTwzb4",
    authDomain: "adsumus-bot.firebaseapp.com",
    databaseURL: "https://adsumus-bot.firebaseio.com",
    projectId: "adsumus-bot",
    storageBucket: "adsumus-bot.appspot.com",
    messagingSenderId: "1073172880535",
    appId: "1:1073172880535:web:7e39fc4c96e368de"
};

firebase.initializeApp(configBase);
const database = firebase.database();

global.prefix = '';
global.xp = '';
global.proxNivel = '';
global.ouro = 100;
global.nivel = '';

client.on("ready", () => {
    console.log(`Bot foi iniciado`);
    client.user.setGame(`XanFrango`);
})

client.on("message", async message => {
    const idCliente = message.author.id;
    const adsumus = config.adsumus == idCliente;
    const idBot = config.id_bot == idCliente
    if (!idBot) {
        database.ref(`servidores/niveis/${message.guild.id}/${message.author.id}`)
            .once('value').then(async function (data) {
                if (data.val() == null) {
                    database.ref(`servidores/niveis/${message.guild.id}/${message.author.id}`)
                        .set({
                            xp: 0,
                            nivel: 1,
                            ouro: 100,
                        });
                }
            });
        database.ref(`servidores/niveis/${message.guild.id}/${message.author.id}`)
            .once('value').then(async function (data) {
                if (data.val() == null) {
                    database.ref(`servidores/niveis/${message.guild.id}/${message.author.id}`)
                        .set({
                            xp: 0,
                            nivel: 1
                        });
                }
                else {
                    xp = data.val().xp + addPontos;
                    nivel = data.val().nivel;
                    proxNivel = data.val().nivel * 500;
                    database.ref(`servidores/niveis/${message.guild.id}/${message.author.id}`)
                        .update({
                            xp: xp
                        })
                    if (proxNivel <= xp) {
                        proxNivel = data.val().nivel + 1
                        database.ref(`servidores/niveis/${message.guild.id}/${message.author.id}`)
                            .update({
                                nivel: proxNivel
                            })
                        await message.channel.send(` ${message.author.username} subiu de nivel!`)
                    }
                }
            });
        let addPontos = Math.floor(Math.random() * 7) + 8;
    }

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.prefix)) return;

    //Nivel
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if (comando === "ping") {
        let m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }
    if (comando === "nivel" || comando === "level" || comando === "nv" || comando === "lv") {
        message.channel.send(` Seu nivel é -> ${nivel}`);
    }
    if (comando === "xp" || comando === "experiencia") {
        message.channel.send(` Sua experiencia é -> ${xp}`);
    }

    if (comando === "ajuda" || comando === "help") {
        message.channel.send(` Nossos comandos são: "!ping", "!dado" , "!nivel", "!xp" `)
    }

    try {
        if (comando === "coin" || comando === "moeda" || comando === "flip") {
            database.ref(`${message.author.id}`)
                .once('value').then(async function (data) {
                    if (data.val() == null) {
                        database.ref(`${message.author.id}`)
                            .set({
                                xp: 0,
                                nivel: 1,
                                ouro: 100,
                            });
                    }
                    else {
                        ouro = data.val().ouro
                    }
                    //Futuro xp em dungeon
                    // else {
                    //     xp = data.val().xp + addPontos;
                    //     nivel = data.val().nivel;
                    //     proxNivel = data.val().nivel * 500;
                    //     database.ref(`servidores/niveis/${message.guild.id}/${message.author.id}`)
                    //         .update({
                    //             xp: xp
                    //         })
                    //     if (proxNivel <= xp) {
                    //         proxNivel = data.val().nivel + 1
                    //         database.ref(`servidores/niveis/${message.guild.id}/${message.author.id}`)
                    //             .update({
                    //                 nivel: proxNivel
                    //             })
                    //         await message.channel.send(` ${message.author.username} subiu de nivel!`)
                    //     }
                    // }
                });
            if (comando === "moeda") {
                var aposta = message.content.substr(7).split(' ');
            }
            else {
                var aposta = message.content.substr(6).split(' ');
            }
            const valorAposta = parseInt(aposta[1]);
            aposta[0].toLowerCase();
            if (aposta[0] != "cara" && aposta[0] != "coroa") {
                throw "moeda";
            }
            resultado = Math.floor(Math.random() * 2).toString();
            if (resultado === "1") {
                resultado = "cara";
            }
            else {
                resultado = "coroa";
            }
            if (ouro < valorAposta) {
                throw "dinheiro";
            }


            if (aposta[0] == resultado) {
                database.ref(`${message.author.id}`)
                    .update({
                        ouro: ouro + valorAposta
                    })
                message.channel.send(`Você ganhou! `)
            }
            else {
                database.ref(`${message.author.id}`)
                    .update({
                        ouro: ouro - valorAposta
                    })
                message.channel.send(`Você perdeu! `)
            }
        }
    } catch (error) {
        if (error === "dinheiro") {
            message.channel.send(`Você é pobre te falta dinheiro! `)
        }
        else if (error === "moeda") {
            message.channel.send(`Digite o lado da moeda certo, "cara" ou "coroa"`)
        }
        else {
            message.channel.send(`Repita o comando de forma certa -> "!moeda x y" substituindo x pelo lado desejado e y pela quantia de dinheiro que irá apostar.`);
        }

    }
    if (comando === "ouro" || comando === "gold") {
        database.ref(`${message.author.id}`)
            .once('value').then(async function (data) {
                if (data.val() == null) {
                    database.ref(`${message.author.id}`)
                        .set({
                            xp: 0,
                            nivel: 1,
                            ouro: 100,
                        });
                }
                else {
                    ouro = data.val().ouro
                }
            });
        message.channel.send(`Sua riqueza é de ${ouro}`);
    }
    try {
        // if (!adsumus && comando === "dado" || comando === "roll") {
        if (comando === "dado" || comando === "roll") {
            let valor = message.content.substr(5);
            let rolagem = valor.split('d');
            let total;
            if (rolagem.length == 2) {
                let count = 0;
                let valorAntigo = 0;
                while (count < rolagem[0]) {
                    total = valorAntigo + Math.floor(Math.random() * rolagem[1]) + 1;
                    valorAntigo = total;
                    count++;
                }
            }
            else {
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
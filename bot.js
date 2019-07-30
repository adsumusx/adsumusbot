const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const firebase = require("firebase");
const getBanco = require("./getBanco.js")
const setBanco = require("./setAndUpdateBanco.js")
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
global.messagem = '';

client.on("ready", () => {
    console.log(`Bot foi iniciado`);
    client.user.setGame(`XanFrango`);
})

client.on("message", async message => {
    messagem = message;
    const idCliente = message.author.id;
    const adsumus = config.adsumus == idCliente;
    const idBot = config.id_bot == idCliente
    if (!idBot) {
        setTimeout(function () {
            getXp(message, idCliente)
        }, 300);
    }
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if (comando === "ping") {
        let m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }

    if (comando === "nivel" || comando === "level" || comando === "nv" || comando === "lv") {
        getXp(idCliente);
        setTimeout(function () {
            message.channel.send(` Seu nivel é -> ${nivel}`);
        }, 300);
    }

    if (comando === "xp" || comando === "experiencia") {
        message.channel.send(` Sua experiencia é -> ${xp}`);
    }

    if (comando === "ajuda" || comando === "help") {
        message.channel.send(` Nossos comandos são: "!ping", "!dado" , "!nivel", "!xp", "!moeda", "!gold" `)
    }

    try {
        if (comando === "coin" || comando === "moeda" || comando === "flip") {

            if (comando === "moeda") {
                var aposta = message.content.substr(7).split(' ');
            }
            else {
                var aposta = message.content.substr(6).split(' ');
            }

            const valorAposta = parseInt(aposta[1]);
            const ladoMoeda = aposta[0].toLowerCase();

            if (ladoMoeda != "cara" && ladoMoeda != "coroa") {
                throw "moeda";
            }

            setTimeout(function () {
                getGold(idCliente);
            }, 300);

            if (ouro < valorAposta) {
                throw "dinheiro";
            }

            resultado = Math.floor(Math.random() * 2).toString();

            if (resultado === "1") {
                resultado = "cara";
            }
            else {
                resultado = "coroa";
            }

            if (ladoMoeda == resultado) {
                setGold(idCliente, "add", valorAposta)
                message.channel.send(`Deu ${resultado} Você ganhou!`)
            }
            else {
                setGold(idCliente, "remover", valorAposta)
                message.channel.send(`Deu ${resultado} Você perdeu!`)
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
        getGold(idCliente);

        setTimeout(function () {
            message.channel.send(`Sua riqueza é de R$${ouro}.00`);
        }, 300);
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
            if (!isNaN(total) && rolagem[0] != '' && rolagem[0] != 0 && rolagem[1] != 0) {
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














function getXp(message, idCliente) {
    let addPontos = Math.floor(Math.random() * 7) + 8;
    database.ref(`servidores/niveis/${message.guild.id}/${idCliente}`).once('value').then(async function (data) {
        if (data.val() == null) {
            setXp(message.guild.id, idCliente, "null", 0)
        }
        else {
            xp = data.val().xp + addPontos;
            nivel = data.val().nivel;
            proxNivel = data.val().nivel * 500;
            setTimeout(function () {
                setXp(message.guild.id, idCliente, "atualizarXp", xp);
            }, 300);
        }
        console.log(proxNivel, xp);
        if (proxNivel <= xp) {
            proxNivel = data.val().nivel + 1
            await message.channel.send(` ${message.author.username} subiu para o nivel ${data.val().nivel + 1}!`)
            setXp(message.guild.id, idCliente, "atualizarNv", xp)
        }
    });
}

function getGold(idCliente) {
    database.ref(`${idCliente}`).once('value').then(async function (data) {
        console.log(data.val())
        if (data.val() == null) {
            setGold(idCliente);
        }
        else {
            ouro = data.val().ouro
        }
    });
}

function setXp(idServidor, idCliente, statusXp) {
    if (statusXp == "null") {
        database.ref(`servidores/niveis/${idServidor}/${idCliente}`)
            .set({
                xp: 0,
                nivel: 1,
                ouro: 100,
            });
    }
    else if (statusXp == "atualizarXp") {
        database.ref(`servidores/niveis/${idServidor}/${idCliente}`)
            .update({
                xp: xp
            })
    }
    else if (statusXp == "atualizarNv") {
        database.ref(`servidores/niveis/${idServidor}/${idCliente}`)
            .update({
                nivel: proxNivel
            })
    }
}


function setGold(idCliente, tipo, valorOuro) {
    if (tipo == "add") {
        database.ref(`${idCliente}`)
            .update({
                ouro: ouro + valorOuro
            })
    }
    else {
        database.ref(`${idCliente}`)
            .update({
                ouro: ouro - valorOuro
            })
    }
}
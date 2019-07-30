const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const firebase = require("firebase");
const bot = require("./bot.js");
const setBanco = require("./setAndUpdateBanco.js");

exports.teste = function teste1 (a) {
    return a;
}



function getXp(idServidor, idCliente) {
    database.ref(`servidores/niveis/${idServidor}/${idCliente}`).once('value').then(async function (data) {
        if (data.val() == null) {
            setBando.setXp(idServidor, idCliente, "null", 0)
        }
        else {
            bot.xp = data.val().xp + addPontos;
            bot.nivel = data.val().nivel;
            bot.proxNivel = data.val().nivel * 500;
            setBanco.setXp(idServidor, idCliente, "atualizarXp", bot.xp)
        }
        if (bot.proxNivel <= bot.xp) {
            bot.proxNivel = data.val().nivel + 1
            setBanco.setXp(idServidor, idCliente, "atualizarNv", bot.xp)
            await message.channel.send(` ${bot.messagem.author.username} subiu de nivel!`)
        }
        let addPontos = Math.floor(Math.random() * 7) + 8;
    });
}

function getGold(idCliente) {
    database.ref(`${idCliente}`)
        .once('value').then(async function (data) {
            if (data.val() == null) {
                setBanco.setGold(idCliente);
            }
            else {
                bot.ouro = data.val().ouro
            }
        });
}

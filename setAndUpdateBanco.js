const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const firebase = require("firebase");
const bot = require("./bot.js");
const getBanco = require("./getBanco.js");


exports.setXp = function setXp(idServidor, idCliente, statusXp) {
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


exports.setGold = function setGold(idCliente, tipo, valorOuro) {
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
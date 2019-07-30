const Discord = require("discord.js");
const config = require("./config.json");
const setBanco = require("./setAndUpdateBanco.js");

exports.getXp = function getXp (message, idCliente) {
    let addPontos = Math.floor(Math.random() * 7) + 8;
    database.ref(`servidores/niveis/${message.guild.id}/${idCliente}`).once('value').then(async function (data) {
        if (data.val() == null) {
            setBanco.setXp(message.guild.id, idCliente, "null", 0)
        }
        else {
            xp = data.val().xp + addPontos;
            nivel = data.val().nivel;
            proxNivel = data.val().nivel * 500;
            setTimeout(function () {
                setBanco.setXp(message.guild.id, idCliente, "atualizarXp", xp);
            }, 300);
        }
        if (proxNivel <= xp) {
            proxNivel = data.val().nivel + 1
            await message.channel.send(` ${message.author.username} subiu para o nivel ${data.val().nivel + 1}!`)
            setBanco.setXp(message.guild.id, idCliente, "atualizarNv", xp)
        }
    });
}



exports.getGold = function getGold(idCliente) {
    database.ref(`${idCliente}`).once('value').then(async function (data) {
        if (data.val() == null) {
            setBanco.setGold(idCliente);
        }
        else {
            ouro = data.val().ouro
        }
    });
}

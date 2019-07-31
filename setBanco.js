const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const getBanco = require("./getBanco.js");


exports.setXp = async function (idServidor, idCliente, statusXp) {
    try {
        if (statusXp == "null") {
            database.ref(`servidores/niveis/${idServidor}/${idCliente}`)
                .set({
                    xp: 0,
                    nivel: 1,
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
    } catch (error) {

    }
}

exports.setNpc = async function (idCliente, statusNpc, nomeNpc) {
    try {
        if (statusNpc == "null") {
            database.ref(`${idCliente}`)
                .set({
                    nomeNpc: nomeNpc,
                    nivelNpc: 1,
                    ouro: 100,
                    xpNpc: 0,
                    dano: 1,
                    vida: 10,
                    estamina: 5
                });
        }
        else if (statusNpc == "atualizarXp") {
            database.ref(`${idCliente}`)
                .update({
                    xpNpc: xpNpc,
                    vida: vida,
                    estamina: estamina
                })
        }
        else if (statusNpc == "atualizarNv") {
            database.ref(`${idCliente}`)
                .update({
                    nivelNpc: proxNivel,
                    xpNpc: xpNpc,
                    dano: dano + 2,
                    vida: vida + 3,
                    estamina: estamina + 1
                })
        }
    } catch (error) {

    }

}


exports.setGold = async function (idCliente, tipo, valorOuro) {
    try {
        await getBanco.getGold(idCliente);
        if (tipo == "add") {
            database.ref(`${idCliente}`)
                .update({
                    ouro: ouro + valorOuro
                })
        }
        else if (tipo == "remover") {
            database.ref(`${idCliente}`)
                .update({
                    ouro: ouro - valorOuro
                })
        }
    } catch (error) {

    }
}
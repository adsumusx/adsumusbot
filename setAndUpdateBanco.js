const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const getBanco = require("./getBanco.js");


exports.setXp = async function setXp(idServidor, idCliente, statusXp) {
    try {
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
    } catch (error) {

    }

}


exports.setGold = async function setGold(idCliente, tipo, valorOuro) {
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
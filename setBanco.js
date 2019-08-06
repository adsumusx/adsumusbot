const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const getBanco = require("./getBanco.js");

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
                    nivelNpc: nivelNpc,
                    xpNpc: xpNpc,
                    dano: dano + 2,
                    vida: nivelNpc * 2 + 10,
                    estamina: nivelNpc * 2 + 2
                })
        }
        else if (statusNpc == "atualizarNpc") {
            database.ref(`${idCliente}`)
                .update({
                    ouro: ouro,
                    xpNpc: xpNpc,
                    estamina: estamina
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

exports.setDungeon = async function (idCliente, date, status) {
    try {
        if(status == 'iniciar'){
            database.ref(`${idCliente}`)
            .update({
                dungeon: date
            })
        }
        else if(status == 'terminar'){
            database.ref(`${idCliente}`)
            .update({
                dungeon: '',
                xpNpc: xpNpc,
                gold: gold
            })
        }
        else if(status == 'upar'){
            database.ref(`${idCliente}`)
            .update({
                dungeon: '',
                xpNpc: xpNpc,
                nivelNpc: nivelNpc,
                gold: gold
            })
        }
    } catch (error) {

    }
}
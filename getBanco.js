const Discord = require("discord.js");
const config = require("./config.json");
const setBanco = require("./setBanco.js");
const { Canvas } = require('canvas-constructor');
const fetch = require('node-fetch');

exports.getXp = async function (message, idCliente) {

    let addPontos = Math.floor(Math.random() * 7) + 8;
    database.ref(`servidores/niveis/${message.guild.id}/${idCliente}`).once('value').then(async function (data) {
        if (data.val() == null) {
            await setBanco.setXp(message.guild.id, idCliente, "null", 0)
        }
        else {
            xp = data.val().xp + addPontos;
            nivel = data.val().nivel;
            proxNivel = data.val().nivel * 500;
            await setBanco.setXp(message.guild.id, idCliente, "atualizarXp", xp);
        }
        if (proxNivel <= xp) {
            proxNivel = data.val().nivel + 1
            message.channel.send(` ${message.author.username} subiu para o nivel ${data.val().nivel + 1}!`)
            await setBanco.setXp(message.guild.id, idCliente, "atualizarNv", xp)
        }
    });
}

exports.getNpc = async function (message, idCliente) {
    await database.ref(`${idCliente}`).once('value').then(async function (data) {
        if (data.val() == null) {
            message.channel.send(`Você não possui nenhum personagem, tente usar o comando !criar`);
        }
        else {
            nomeNpc = data.val().nomeNpc;
            nivelNpc = data.val().nivelNpc;
            ouro = data.val().ouro;
            xpNpc = data.val().xpNpc;
            dano = data.val().dano;
            vida = data.val().vida;
            estamina = data.val().estamina;
        }
    });
}



exports.getGold = async function (idCliente) {
    await database.ref(`${idCliente}`).once('value').then(async function (data) {
        if (data.val() == null) {
            ouro = '';
        }
        else {
            ouro = data.val().ouro
        }
    });
}

exports.getProfile = async function (message) {
    const member = message.member;
    const imageUrlRegex = /\?size=2048$/g;
    await exports.getNpc(message, message.author.id)
    if (nomeNpc != '') {
        try {
            const result = await fetch(member.user.displayAvatarURL.replace(imageUrlRegex, '?size=128'));
            if (!result.ok) throw new Error('Failed to get the avatar!');
            const avatar = await result.buffer();

            return new Canvas(400, 180)
                .setColor('#7289DA')
                .addRect(84, 0, 316, 180)
                .setColor("#2C2F33")
                .addRect(0, 0, 84, 180)
                .addRect(169, 26, 231, 46)
                .addRect(224, 108, 176, 46)
                .setShadowColor('rgba(22, 22, 22, 1)')
                .setShadowOffsetY(5)
                .setShadowBlur(10)
                .addCircle(84, 90, 62)
                .addCircularImage(avatar, 85, 90, 64)
                .save()
                .createBeveledClip(20, 138, 128, 32, 5)
                .setColor('#23272A')
                .fill()
                .restore()
                .setTextAlign('center')
                // .setTextFont("font-family='Arial'")
                .setTextSize(16)
                .setColor('#FFFFFF')
                .addText(nomeNpc, 285, 54)
                .addText(`Nivel: ${nivelNpc}`, 84, 159)
                .setTextAlign('left')
                .addText(`Experiência: ${xpNpc}`, 250, 125)
                .addText(`Ouro: ${ouro}`, 250, 145)
                .toBuffer();
        }
        catch (error) {
            await message.channel.send(`Deu erro mané`);
        }
    }

} 
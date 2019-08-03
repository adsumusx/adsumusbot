const Discord = require("discord.js");
const config = require("./config.json");
const setBanco = require("./setBanco.js");
const { Canvas } = require('canvas-constructor');
const CanvasImage = require('canvas');
const fetch = require('node-fetch');

exports.getXp = async function (message, idCliente) {
    await database.ref(`${idCliente}`).once('value').then(async function (data) {
        if (data != null) {
            xpNpc = data.val().xpNpc;
            nivelNpc = data.val().nivelNpc;
        }
        else {
            message.channel.send(`Você não possui nenhum personagem, tente usar o comando !criar`);
        }
    });
}

exports.getNpc = async function (message, idCliente) {
    await database.ref(`${idCliente}`).once('value').then(async function (data) {
        if (data.val().nomeNpc == null) {
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
            const background = await CanvasImage.loadImage("./assets/imgs/caverna.jpg");
            return new Canvas(800, 455)
                // .setColor('#7289DA')
                // .addRect(200, 0, 500, 280)
                // .setColor("#2C2F33")
                // .addRect(0, 0, 200, 280)
                //1 da segunda parte
                // .addRect(100, 26, 231, 46)
                //2 da segunda parte
                // x y z h: x =
                .addRect(100, 108, 176, 46)
                .setShadowColor('rgba(22, 22, 22, 1)')
                .setShadowOffsetY(5)
                .setShadowBlur(10)
                .addCircle(100, 115, 100)
                // x y z - y = altura
                .addImage(background, 1, 1)
                .addCircularImage(avatar, 170, 160, 100)
                .save()
                .createBeveledClip(70, 1, 1, 40, 5)
                .setColor('#23272A')
                .fill()
                .restore()
                .setTextAlign('center')
                // .setTextFont("font-family='Arial'")
                .setTextSize(30)
                .setColor('#FFFFFF')
                .addText(nomeNpc, 170, 295)
                .setTextAlign('left')
                .addText(`Nivel: ${nivelNpc}`, 320, 100)
                .addText(`Experiência: ${xpNpc}`, 320, 140)
                .addText(`Dano: ${dano}`, 320, 180)
                .addText(`Vida: ${vida}`, 320, 220)
                .addText(`Estamina: ${estamina}`, 320, 260)
                .addText(`Ouro: ${ouro}`, 320, 300)
                .toBuffer();
        }
        catch (error) {
            await message.channel.send(`Deu erro mané`);
        }
    }

} 
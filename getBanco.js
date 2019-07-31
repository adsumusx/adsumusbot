const Discord = require("discord.js");
const config = require("./config.json");
const setBanco = require("./setAndUpdateBanco.js");
const { Canvas } = require('canvas-constructor');
const fetch = require('node-fetch');

exports.getXp = async function (message, idCliente) {

    let addPontos = Math.floor(Math.random() * 7) + 8;
    database.ref(`servidores/niveis/${message.guild.id}/${idCliente}`).once('value').then(async function (data) {
        if (data.val() == null) {
            setBanco.setXp(message.guild.id, idCliente, "null", 0)
        }
        else {
            xp = data.val().xp + addPontos;
            nivel = data.val().nivel;
            proxNivel = data.val().nivel * 500;
            setBanco.setXp(message.guild.id, idCliente, "atualizarXp", xp);
        }
        if (proxNivel <= xp) {
            proxNivel = data.val().nivel + 1
            message.channel.send(` ${message.author.username} subiu para o nivel ${data.val().nivel + 1}!`)
            setBanco.setXp(message.guild.id, idCliente, "atualizarNv", xp)
        }
    });
}



exports.getGold = async function (idCliente) {
    await database.ref(`${idCliente}`).once('value').then(async function (data) {
        if (data.val() == null) {
            setBanco.setGold(idCliente);
        }
        else {
            ouro = data.val().ouro
        }
    });
}

exports.getProfile = async function profile(message) {
    const member = message.member;
    const imageUrlRegex = /\?size=2048$/g;
    await exports.getXp(message, idCliente);
    await exports.getGold(idCliente);
    try {
      const result = await fetch(member.user.displayAvatarURL.replace(imageUrlRegex, '?size=128'));
      if (!result.ok) throw new Error('Failed to get the avatar!');
      const avatar = await result.buffer();

      const name = member.displayName.length > 30 ? member.displayName.substring(0, 17) + '...'
        : member.displayName;
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
        .addText(name, 285, 54)
        .addText(`Nivel: ${nivel}`, 84, 159)
        .setTextAlign('left')
        .addText(`Experiencia: ${xp}`, 250, 125)
        .addText(`Ouro ${ouro}`, 250, 145)
        .toBuffer();
    } catch (error) {
      await message.channel.send(`Deu erro mané`);
    }
  } 
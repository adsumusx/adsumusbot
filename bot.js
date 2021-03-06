const Discord = require("discord.js");
const { Attachment } = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const firebase = require("firebase");
const getBanco = require("./getBanco.js");
const setBanco = require("./setBanco.js")
const sleep = require("./sleep.js")
//ADICIONE UM TOKEN NO ARQUIVO CONFIG.JSON PARA FUNCIONAR 'M'
//ADICIONE UM TOKEN NO ARQUIVO CONFIG.JSON PARA FUNCIONAR 'M'
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
global.database = firebase.database();
global.prefix = '';
global.proxNivelNpc = '';
global.ouro = '';
global.messagem = '';
global.idCliente = '';
global.xpNpc = '';
global.nivelNpc = '';
global.nomeNpc = '';
global.vida = '';
global.dano = '';
global.estamina = '';
global.dungeon = '';


client.on("ready", () => {
    console.log(`Bot foi iniciado`);
    client.user.setGame(`IDLE RPG`);
})

client.on("message", async message => {
    messagem = message;
    idCliente = message.author.id;

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.prefix)) return;

    //Pegar comando que o usuario digitou
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    const conteudo = message.content.substr(comando.length + config.prefix.length + 1).split(' ');
    //Comando !ping (retorna latencia da API e do BOT)
    if (comando === "ping") {
        let m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }

    //Comando !nivel (Verifica o nivel que o usuario está)
    if (comando === "nivel" || comando === "level" || comando === "nv" || comando === "lv") {
        getBanco.getXp(message, idCliente);
        setTimeout(function () {
            message.channel.send(` Seu nivel é -> ${nivelNpc}`);
        }, 300);
    }

    //Comando !xp (Verifica a quantidade de experiencia que o usuario tem)
    if (comando === "xp" || comando === "experiencia") {
        getBanco.getXp(message, idCliente);
        setTimeout(function () {
            message.channel.send(` Sua experiencia é -> ${xpNpc}`);
        }, 300);
    }

    //Comando !ajuda (Retorna todos comandos)
    if (comando === "ajuda" || comando === "help") {
        message.channel.send(` Nossos comandos são: "!ping", "!dado" , "!nivel", "!xp", "!moeda", "!ouro" , "!perfil", "!criar", "!transferir", "!batalha" `)
    }

    //Comando !flip (Aposta em um lado da moeda)
    if (comando === "coin" || comando === "moeda" || comando === "flip" || comando === "aposta") {
        try {
            const valorAposta = parseInt(conteudo[1]);
            const ladoMoeda = conteudo[0].toLowerCase();
            if (ladoMoeda != "cara" && ladoMoeda != "coroa" && ladoMoeda != "heads" && ladoMoeda != "tails") {
                throw "moeda";
            }

            await getBanco.getGold(idCliente);

            if (ouro < valorAposta) {
                throw "dinheiro";
            }

            let resultado = Math.floor(Math.random() * 2).toString();

            if (resultado === "1") {
                resultado = "cara";
            }
            else {
                resultado = "coroa";
            }

            if (ladoMoeda == resultado) {
                setBanco.setGold(idCliente, "add", valorAposta)
                message.channel.send(`Deu *${resultado.toUpperCase()}* Você ganhou!`)
            }
            else {
                setBanco.setGold(idCliente, "remover", valorAposta)
                message.channel.send(`Deu ${resultado.toUpperCase()} Você perdeu!`)
            }
        }
        catch (error) {
            if (error === "dinheiro") {
                message.channel.send(`Você é pobre lhe falta dinheiro! `)
            }
            else if (error === "moeda") {
                message.channel.send(`Digite o lado da moeda certo, "cara" ou "coroa"`)
            }
            else {
                message.channel.send(`Repita o comando de forma certa -> "!moeda x y" substituindo x pelo lado desejado e y pela quantia de dinheiro que irá apostar.`);
            }
        }
    }

    //Comando !ouro (Verifica quantidade de ouro do usuario.)
    if (comando === "ouro" || comando === "gold") {
        await getBanco.getGold(idCliente);
        setTimeout(function () {
            if (ouro.length == 0 && ouro.length != undefined) {
                message.channel.send(`Você não possui nenhum personagem, tente usar o comando !criar`);
            }
            else {
                message.channel.send(`Sua riqueza é de R$${ouro}`);
            }
        }, 300);
    }

    //Comando !dado (rola a quantia de dados que o usuario quiser)
    // if (!adsumus && comando === "dado" || comando === "roll") {
    if (comando === "dado" || comando === "roll" || comando === "r" || comando === "d") {
        try {
            let valorDado = message.content.substr(comando.length + config.prefix.length + 1);
            let rolagem = valorDado.split('d');
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
                total = Math.floor(Math.random() * conteudo) + 1;
            }
            if (!isNaN(total) && rolagem[0] != '' && rolagem[0] != 0 && rolagem[1] != 0) {
                message.channel.send(` O valor do dado foi -> ${conteudo} com o total de ->  ${total}`);
            }
            else {
                error;
            }
        }
        catch (error) {
            message.channel.send(`Repita o comando de forma certa -> "!dado x" usando apenas valores númericos`);
        }
        // else if(adsumus){
        //     let valor = message.content.substr(5);
        //     message.channel.send(` O valor do dado foi -> ${valor} com o total de ->  ${valor}`);
        // }
    }

    //Comando !transferir (transfere gold de um usuario para outro)
    if (comando === "transferir") {
        try {
            let valorTrans = parseInt(conteudo[0]);
            let idRecebedor = conteudo[1].replace("<@", "").replace(">", "");
            if (idRecebedor.length != 18) {
                throw "usuario";
            }


            await getBanco.getGold(idCliente);
            if (ouro < valorTrans) {
                throw "dinheiro";
            }
            await setBanco.setGold(idCliente, "remover", valorTrans)
            await setBanco.setGold(idRecebedor, "add", valorTrans)
            message.channel.send(`${message.author.username} transferiu com sucesso *R$${valorTrans}* para ${conteudo[1]}`)

        } catch (error) {
            if (error === "dinheiro") {
                message.channel.send(`Você é pobre lhe falta dinheiro! `)
            }
            else if (error === "usuario") {
                message.channel.send(`Você não marcou nenhum usuario, use '@nome_do_usuario' . `)
            }
            else {
                message.channel.send(`Repita o comando de forma correta -> "!transferir x @y substituindo x pela quantia que irá tranferir e y marcando a pessoa que deseja transferir.`)
            }
        }
    }
    //Comando !perfil (Mostra perfil do usuario - nome/xp/nivel/gold)
    if (comando === "perfil" || comando === "profile" || comando === "p") {
        try {
            const buffer = await getBanco.getProfile(message);
            const filename = `profile-${message.author.id}.jpg`;
            const attachment = new Attachment(buffer, filename);
            await message.channel.send(attachment);
        } catch (error) {
            // client.logger.error(error.stack)
            return message.channel.send(`Deu erro zé ruela`);
        }
    }
    //Comando !criar (criar novo personagem)
    if (comando === "criar") {
        try {
            let nomeNpc = message.content.substr(comando.length + config.prefix.length + 1);
            if (nomeNpc.length > 0) {
                await setBanco.setNpc(idCliente, "null", nomeNpc);
                message.channel.send(`Personagem *${nomeNpc}* criado com sucesso`)
            }
            else {
                throw "nomeNpc";
            }
        } catch (error) {
            // client.logger.error(error.stack);
            if (error === "nomeNpc") {
                return message.channel.send(`Adicione um nome de personagem valido`);
            }
            else {
                return message.channel.send(`Repita o comando de forma certa -> !criar nome_personagem`);
            }
        }
    }
    //Comando !batalha (personagem do usuario combate um NPC aleatorio)
    if (comando === "batalha" || comando === "combate") {
        try {
            await getBanco.getNpc(message, idCliente);
            let dificuldade = parseInt(conteudo[1]);
            if (ouro.length == 0 && ouro.length != undefined) {
                throw "semPersonagem";
            }
            else {
                if (dificuldade > 0) {
                    let danoInimigo = 1 + dificuldade + nivelNpc;
                    let vidaInimigo = 2 * nivelNpc + dificuldade;
                    proxNivelNpc = Math.pow(nivelNpc, 3) + 10;
                    if (estamina > 0) {
                        while (vida > 0 && vidaInimigo > 0) {
                            let atk = Math.floor(Math.random() * dano) + 1
                            vidaInimigo = vidaInimigo - atk
                            // message.channel.send(`${nomeNpc} deu ${dano} de dano no seu oponente, deixando-o com ${vidaInimigo} de vida!`);
                            if (vidaInimigo > 0) {
                                let atkInimigo = Math.floor(Math.random() * danoInimigo) + 1
                                vida = vida - atkInimigo
                                // sleep.sleep(1300);
                                // message.channel.send(`O terrivel monstro nivel ${dificuldade} deu ${dano} de dano no seu oponente ${nomeNpc}, deixando-o com ${vida} de vida!`);
                            }
                        }
                        if (vidaInimigo <= 0 || vida > 0) {
                            xpNpc = xpNpc + Math.floor(Math.random() * dificuldade) + 1 * vida / nivelNpc;
                            xpNpc = Math.round(xpNpc);
                            message.channel.send(`${nomeNpc} acaba de **GANHAR** uma épica batalha contra um monstro de nivel ${dificuldade}`)
                        }
                        else {
                            message.channel.send(`${nomeNpc} acaba de **PERDER** uma épica batalha contra um monstro de nivel ${dificuldade}`);
                        }
                        estamina--;
                        await setBanco.setNpc(idCliente, "atualizarNpc", nomeNpc);
                        if (proxNivelNpc <= xpNpc) {
                            nivelNpc++;
                            message.channel.send(` ${nomeNpc} subiu para o nivel ${nivelNpc}!`)
                            await setBanco.setNpc(idCliente, "atualizarNv", nomeNpc);
                        }

                    }
                    else {
                        throw "estamina"
                    }
                }
                else {
                    throw "dificuldade";
                }
            }
        } catch (error) {
            if (error == "dificuldade") {
                message.channel.send(`Repita o comando de forma correta -> !batalha nv x substituindo x pelo nivel de dificuldade`)
            }
            if (error == "estamina") {
                message.channel.send(`Você não tem estamina suficiente para combater`)
            }
        }
    }
    //Comando !dungeon (personagem do usuario entra em uma dugeon por determinado tempo)
    if (comando === "dungeon" || comando === "aventura") {
        try {
            await getBanco.getDungeon(idCliente);
            let dificuldade = parseInt(conteudo[0]);
            let date = new Date();
            console.log(dungeon.length, nomeNpc);

            if (dungeon.length == 0 && nomeNpc != '') {
                date.setMinutes(date.getMinutes() + dificuldade * 30)

                await setBanco.setDungeon(idCliente, date);
                message.channel.send(`${nomeNpc} acaba de entrar em uma dungeon nivel ${dificuldade}!`)
            }
            else if (dungeon.length != 0) {
                if (date <= dungeon) {
                    await setBanco.setDungeon(idCliente, '');
                    message.channel.send(`${nomeNpc} acaba de terminar uma dungeon!`)
                }
                else {
                    dungeon = new Date(dungeon);
                    dungeon = dungeon.getTime() - date.getTime()
                    let segundos = Math.trunc((dungeon / 1000) % 60);   
                    let minutos = Math.trunc((dungeon / 60000) % 60); 
                    let horas = Math.trunc(dungeon / 3600000);
                    message.channel.send(`Ainda falta ${horas} hr(s), ${minutos} minuto(s) e ${segundos} segundo(s) para ${nomeNpc} terminar sua dungeon`)
                }
            }
            else {
                message.channel.send(`Você não possui nenhum personagem, tente usar o comando !criar`);
            }
        } catch (error) {

        }
    }
});

client.login(config.token);

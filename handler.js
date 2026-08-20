const config = require("../config");
const commandes = require("./commandes");
const { estAdmin } = require("./commandes/groupe");

function getTexteMessage(msg) {
  const m = msg.message;
  return (
    m?.conversation ||
    m?.extendedTextMessage?.text ||
    m?.imageMessage?.caption ||
    m?.videoMessage?.caption ||
    ""
  );
}

async function downloadMedia(mediaMessage, type) {
  const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
  const stream = await downloadContentFromMessage(mediaMessage, type);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  return buffer;
}

async function traiterMessage(sock, msg) {
  const from = msg.key.remoteJid;
  const texte = getTexteMessage(msg).trim();

  if (!texte.startsWith(config.PREFIXE)) return;

  const args = texte.slice(config.PREFIXE.length).trim().split(/\s+/);
  const nomCommande = args.shift().toLowerCase();
  const commande = commandes[nomCommande];

  if (!commande) return;

  const estGroupe = from.endsWith("@g.us");

  if (commande.requiertGroupe && !estGroupe) {
    await sock.sendMessage(from, {
      text: "⚠️ Cette commande fonctionne uniquement dans un groupe.",
    });
    return;
  }

  const expediteur = msg.key.participant || msg.key.remoteJid;

  if (commande.requiertAdmin && estGroupe) {
    const admin = await estAdmin(sock, from, expediteur);
    if (!admin) {
      await sock.sendMessage(from, {
        text: "⚠️ Seuls les admins du groupe peuvent utiliser cette commande.",
      });
      return;
    }
  }

  if (commande.requiertAdminBot && estGroupe) {
    const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
    const botEstAdmin = await estAdmin(sock, from, botId);
    if (!botEstAdmin) {
      await sock.sendMessage(from, {
        text: "⚠️ Le bot doit être admin du groupe pour faire ça.",
      });
      return;
    }
  }

  await commande.executer({
    sock,
    msg,
    from,
    args,
    texte,
    toutesLesCommandes: commandes,
    downloadMedia,
  });
}

module.exports = { traiterMessage, getTexteMessage, downloadMedia };

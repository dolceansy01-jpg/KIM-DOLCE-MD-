const config = require("../../config");

const debut = Date.now();

function formatDuree(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

module.exports = {
  menu: {
    description: "Affiche le menu principal du bot",
    categorie: "Général",
    executer: async ({ sock, from, toutesLesCommandes }) => {
      const categories = {};
      for (const [nom, cmd] of Object.entries(toutesLesCommandes)) {
        if (!categories[cmd.categorie]) categories[cmd.categorie] = [];
        categories[cmd.categorie].push(nom);
      }
      let texte = `╭─❖ *${config.NOM_BOT}* ❖─╮\n\n`;
      for (const [cat, cmds] of Object.entries(categories)) {
        texte += `┌─「 *${cat}* 」\n`;
        cmds.forEach((c) => (texte += `│ • .${c}\n`));
        texte += `└───────\n\n`;
      }
      texte += `_Total : ${Object.keys(toutesLesCommandes).length} commandes_`;
      await sock.sendMessage(from, { text: texte });
    },
  },

  menugroupe: {
    description: "Affiche uniquement les commandes de groupe",
    categorie: "Général",
    executer: async ({ sock, from, toutesLesCommandes }) => {
      const cmds = Object.entries(toutesLesCommandes).filter(
        ([, c]) => c.categorie === "Groupe"
      );
      let texte = `╭─❖ *Commandes de Groupe* ❖─╮\n\n`;
      cmds.forEach(([nom, c]) => (texte += `• .${nom} — ${c.description}\n`));
      await sock.sendMessage(from, { text: texte });
    },
  },

  aide: {
    description: "Explique comment utiliser le bot",
    categorie: "Général",
    executer: async ({ sock, from }) => {
      await sock.sendMessage(from, {
        text: `ℹ️ Envoie *.menu* pour voir toutes les commandes.\nLe préfixe est : *${config.PREFIXE}*`,
      });
    },
  },

  ping: {
    description: "Vérifie si le bot répond",
    categorie: "Général",
    executer: async ({ sock, from }) => {
      const debutCalcul = Date.now();
      const msg = await sock.sendMessage(from, { text: "🏓 Calcul..." });
      const vitesse = Date.now() - debutCalcul;
      await sock.sendMessage(from, { text: `🏓 Pong ! (${vitesse} ms)` });
    },
  },

  uptime: {
    description: "Affiche depuis combien de temps le bot tourne",
    categorie: "Général",
    executer: async ({ sock, from }) => {
      await sock.sendMessage(from, {
        text: `⏱️ En ligne depuis : ${formatDuree(Date.now() - debut)}`,
      });
    },
  },

  proprietaire: {
    description: "Affiche le contact du propriétaire",
    categorie: "Général",
    executer: async ({ sock, from }) => {
      await sock.sendMessage(from, {
        text: `👑 Propriétaire : wa.me/${config.PROPRIETAIRES[0]}`,
      });
    },
  },

  bot: {
    description: "Informations sur le bot",
    categorie: "Général",
    executer: async ({ sock, from }) => {
      await sock.sendMessage(from, {
        text: `🤖 *${config.NOM_BOT}*\nBasé sur Baileys (Node.js)\nPréfixe : ${config.PREFIXE}`,
      });
    },
  },
};

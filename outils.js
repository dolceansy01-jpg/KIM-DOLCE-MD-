module.exports = {
  calcul: {
    description: "Calculatrice (.calcul 12*8+3)",
    categorie: "Outils",
    executer: async ({ sock, from, args }) => {
      const expression = args.join("");
      if (!/^[0-9+\-*/().\s]+$/.test(expression) || !expression) {
        await sock.sendMessage(from, {
          text: "⚠️ Utilise uniquement des chiffres et + - * / ( )",
        });
        return;
      }
      try {
        // eslint-disable-next-line no-eval
        const resultat = Function(`"use strict"; return (${expression})`)();
        await sock.sendMessage(from, { text: `🧮 Résultat : ${resultat}` });
      } catch {
        await sock.sendMessage(from, { text: "⚠️ Expression invalide." });
      }
    },
  },

  heure: {
    description: "Affiche l'heure actuelle",
    categorie: "Outils",
    executer: async ({ sock, from }) => {
      const maintenant = new Date().toLocaleString("fr-FR", {
        timeZone: "America/Port-au-Prince",
      });
      await sock.sendMessage(from, { text: `🕒 ${maintenant}` });
    },
  },

  id: {
    description: "Affiche l'identifiant du chat actuel",
    categorie: "Outils",
    executer: async ({ sock, from }) => {
      await sock.sendMessage(from, { text: `🆔 ${from}` });
    },
  },

  sticker: {
    description: "Transforme une image (envoyée ou en réponse) en sticker",
    categorie: "Outils",
    executer: async ({ sock, from, msg, downloadMedia }) => {
      const cible =
        msg.message.imageMessage ||
        msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
      if (!cible) {
        await sock.sendMessage(from, {
          text: "⚠️ Envoie une image avec la légende .sticker, ou réponds à une image.",
        });
        return;
      }
      const buffer = await downloadMedia(cible, "image");
      await sock.sendMessage(from, { sticker: buffer });
    },
  },
};

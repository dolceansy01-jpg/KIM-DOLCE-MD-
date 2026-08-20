const config = require("./config".replace("./", "../"));

function activerBienvenue(sock) {
  sock.ev.on("group-participants.update", async (evenement) => {
    const { id: groupeId, participants, action } = evenement;

    try {
      const meta = await sock.groupMetadata(groupeId);
      const nomGroupe = meta.subject;

      for (const participantId of participants) {
        const nomMembre = `@${participantId.split("@")[0]}`;

        if (action === "add" && config.MESSAGE_BIENVENUE) {
          const texte = config.TEXTE_BIENVENUE.replace(
            "{membre}",
            nomMembre
          ).replace("{groupe}", nomGroupe);
          await sock.sendMessage(groupeId, {
            text: texte,
            mentions: [participantId],
          });
        }

        if (action === "remove" && config.MESSAGE_AUREVOIR) {
          const texte = config.TEXTE_AUREVOIR.replace(
            "{membre}",
            nomMembre
          ).replace("{groupe}", nomGroupe);
          await sock.sendMessage(groupeId, {
            text: texte,
            mentions: [participantId],
          });
        }
      }
    } catch (err) {
      console.error("Erreur message de bienvenue :", err);
    }
  });
}

module.exports = { activerBienvenue };

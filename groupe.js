/**
 * Commandes réservées aux groupes.
 * `requiertGroupe: true`  -> ne fonctionne que dans un groupe
 * `requiertAdmin: true`   -> l'utilisateur doit être admin du groupe
 * `requiertAdminBot: true`-> le bot doit être admin du groupe
 */

async function estAdmin(sock, groupeId, participantId) {
  const meta = await sock.groupMetadata(groupeId);
  const part = meta.participants.find((p) => p.id === participantId);
  return part?.admin === "admin" || part?.admin === "superadmin";
}

module.exports = {
  tagall: {
    description: "Mentionne tous les membres du groupe",
    categorie: "Groupe",
    requiertGroupe: true,
    executer: async ({ sock, from }) => {
      const meta = await sock.groupMetadata(from);
      const mentions = meta.participants.map((p) => p.id);
      let texte = `📢 *Mention générale*\n\n`;
      mentions.forEach((m) => (texte += `@${m.split("@")[0]}\n`));
      await sock.sendMessage(from, { text: texte, mentions });
    },
  },

  hidetag: {
    description: "Envoie un message en mentionnant tout le monde sans les afficher",
    categorie: "Groupe",
    requiertGroupe: true,
    executer: async ({ sock, from, args }) => {
      const meta = await sock.groupMetadata(from);
      const mentions = meta.participants.map((p) => p.id);
      const texte = args.join(" ") || "📢 Annonce";
      await sock.sendMessage(from, { text: texte, mentions });
    },
  },

  kick: {
    description: "Expulse un membre mentionné (réponds à son message)",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    requiertAdminBot: true,
    executer: async ({ sock, from, msg }) => {
      const cible =
        msg.message.extendedTextMessage?.contextInfo?.participant ||
        msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!cible) {
        await sock.sendMessage(from, {
          text: "⚠️ Mentionne ou réponds au message de la personne à expulser.",
        });
        return;
      }
      await sock.groupParticipantsUpdate(from, [cible], "remove");
    },
  },

  promouvoir: {
    description: "Rend un membre admin (réponds à son message)",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    requiertAdminBot: true,
    executer: async ({ sock, from, msg }) => {
      const cible =
        msg.message.extendedTextMessage?.contextInfo?.participant ||
        msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!cible) return;
      await sock.groupParticipantsUpdate(from, [cible], "promote");
      await sock.sendMessage(from, { text: "✅ Membre promu admin." });
    },
  },

  retrograder: {
    description: "Retire les droits admin d'un membre",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    requiertAdminBot: true,
    executer: async ({ sock, from, msg }) => {
      const cible =
        msg.message.extendedTextMessage?.contextInfo?.participant ||
        msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!cible) return;
      await sock.groupParticipantsUpdate(from, [cible], "demote");
      await sock.sendMessage(from, { text: "✅ Membre rétrogradé." });
    },
  },

  infogroupe: {
    description: "Affiche les informations du groupe",
    categorie: "Groupe",
    requiertGroupe: true,
    executer: async ({ sock, from }) => {
      const meta = await sock.groupMetadata(from);
      await sock.sendMessage(from, {
        text:
          `📋 *${meta.subject}*\n\n` +
          `👥 Membres : ${meta.participants.length}\n` +
          `📝 Description : ${meta.desc || "Aucune"}\n` +
          `🆔 ID : ${meta.id}`,
      });
    },
  },

  lien: {
    description: "Affiche le lien d'invitation du groupe",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    executer: async ({ sock, from }) => {
      const code = await sock.groupInviteCode(from);
      await sock.sendMessage(from, {
        text: `🔗 https://chat.whatsapp.com/${code}`,
      });
    },
  },

  revoquerlien: {
    description: "Génère un nouveau lien d'invitation (annule l'ancien)",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    executer: async ({ sock, from }) => {
      await sock.groupRevokeInvite(from);
      const code = await sock.groupInviteCode(from);
      await sock.sendMessage(from, {
        text: `🔄 Nouveau lien : https://chat.whatsapp.com/${code}`,
      });
    },
  },

  nomgroupe: {
    description: "Change le nom du groupe (.nomgroupe Nouveau Nom)",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    requiertAdminBot: true,
    executer: async ({ sock, from, args }) => {
      if (!args.length) return;
      await sock.groupUpdateSubject(from, args.join(" "));
      await sock.sendMessage(from, { text: "✅ Nom du groupe modifié." });
    },
  },

  descgroupe: {
    description: "Change la description du groupe",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    requiertAdminBot: true,
    executer: async ({ sock, from, args }) => {
      if (!args.length) return;
      await sock.groupUpdateDescription(from, args.join(" "));
      await sock.sendMessage(from, { text: "✅ Description modifiée." });
    },
  },

  fermer: {
    description: "Seuls les admins peuvent écrire dans le groupe",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    requiertAdminBot: true,
    executer: async ({ sock, from }) => {
      await sock.groupSettingUpdate(from, "announcement");
      await sock.sendMessage(from, { text: "🔒 Groupe fermé (admins seulement)." });
    },
  },

  ouvrir: {
    description: "Tout le monde peut de nouveau écrire",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    requiertAdminBot: true,
    executer: async ({ sock, from }) => {
      await sock.groupSettingUpdate(from, "not_announcement");
      await sock.sendMessage(from, { text: "🔓 Groupe ouvert à tous." });
    },
  },

  listeadmins: {
    description: "Liste les admins du groupe",
    categorie: "Groupe",
    requiertGroupe: true,
    executer: async ({ sock, from }) => {
      const meta = await sock.groupMetadata(from);
      const admins = meta.participants.filter(
        (p) => p.admin === "admin" || p.admin === "superadmin"
      );
      let texte = "👑 *Admins du groupe*\n\n";
      admins.forEach((a) => (texte += `• @${a.id.split("@")[0]}\n`));
      await sock.sendMessage(from, {
        text: texte,
        mentions: admins.map((a) => a.id),
      });
    },
  },

  quitter: {
    description: "Fait quitter le bot du groupe",
    categorie: "Groupe",
    requiertGroupe: true,
    requiertAdmin: true,
    executer: async ({ sock, from }) => {
      await sock.sendMessage(from, { text: "👋 Au revoir !" });
      await sock.groupLeave(from);
    },
  },
};

module.exports.estAdmin = estAdmin;

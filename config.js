/**
 * CONFIGURATION — KIM DOLCE MD
 * Modifie ces valeurs selon tes préférences.
 */
module.exports = {
  NOM_BOT: "KIM DOLCE MD",
  PREFIXE: ".",

  // Numéro WhatsApp du bot (format international, sans "+", sans 0 devant)
  // Exemple Haïti : 50938xxxxxx
  NUMERO_TELEPHONE: "50900000000",

  // Numéro(s) du/des propriétaire(s) du bot (sans "+")
  PROPRIETAIRES: ["50900000000"],

  // Fonctionnalités automatiques
  AUTO_VUE_STATUT: true, // voit automatiquement les statuts des contacts
  AUTO_LIKE_STATUT: true, // réagit automatiquement (❤️) aux statuts
  EMOJI_LIKE_STATUT: "❤️",

  MESSAGE_BIENVENUE: true, // message de bienvenue quand qqn rejoint un groupe
  MESSAGE_AUREVOIR: true, // message quand qqn quitte un groupe

  // Texte de bienvenue — {membre} et {groupe} sont remplacés automatiquement
  TEXTE_BIENVENUE:
    "👋 Bienvenue {membre} dans *{groupe}* !\nLis le règlement et amuse-toi bien 🎉",
  TEXTE_AUREVOIR: "😢 {membre} a quitté *{groupe}*. Bonne route !",
};

const blagues = [
  "Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ? Parce que sinon ils tombent dans le bateau.",
  "Qu'est-ce qu'un crocodile qui surveille la Bourse ? Un croco-dile !",
  "Un électron rencontre un proton, il lui dit : « attends je reviens, je dois faire le plein ». Le proton répond : « t'inquiète, moi je reste positif. »",
  "Pourquoi les développeurs confondent Halloween et Noël ? Parce que OCT 31 == DEC 25.",
  "C'est l'histoire d'un mec qui n'aime pas les fins de blagues... il ne finit jamais ses blagues.",
];

const citations = [
  "« La vie, c'est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre. » — Albert Einstein",
  "« Le succès, c'est se promener d'échec en échec avec enthousiasme. » — Winston Churchill",
  "« Le meilleur moyen de prédire l'avenir, c'est de le créer. » — Peter Drucker",
  "« On ne voit bien qu'avec le cœur. » — Antoine de Saint-Exupéry",
];

function alea(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

module.exports = {
  blague: {
    description: "Raconte une blague",
    categorie: "Divertissement",
    executer: async ({ sock, from }) => {
      await sock.sendMessage(from, { text: `😂 ${alea(blagues)}` });
    },
  },

  citation: {
    description: "Envoie une citation inspirante",
    categorie: "Divertissement",
    executer: async ({ sock, from }) => {
      await sock.sendMessage(from, { text: `💬 ${alea(citations)}` });
    },
  },

  piecefacile: {
    description: "Lance une pièce (pile ou face)",
    categorie: "Divertissement",
    executer: async ({ sock, from }) => {
      const resultat = Math.random() < 0.5 ? "Pile 🪙" : "Face 🪙";
      await sock.sendMessage(from, { text: resultat });
    },
  },

  de: {
    description: "Lance un dé (1-6)",
    categorie: "Divertissement",
    executer: async ({ sock, from }) => {
      const n = Math.floor(Math.random() * 6) + 1;
      await sock.sendMessage(from, { text: `🎲 Tu as fait ${n} !` });
    },
  },

  boule8: {
    description: "Pose une question à la boule magique (.boule8 question)",
    categorie: "Divertissement",
    executer: async ({ sock, from, args }) => {
      const reponses = [
        "Oui, certainement.",
        "C'est décidément non.",
        "Demande à nouveau plus tard.",
        "Sans aucun doute.",
        "Je ne peux pas te le dire maintenant.",
        "Les signes indiquent que oui.",
      ];
      if (!args.length) {
        await sock.sendMessage(from, { text: "Pose une question après .boule8" });
        return;
      }
      await sock.sendMessage(from, { text: `🎱 ${alea(reponses)}` });
    },
  },

  amour: {
    description: "Calcule le pourcentage d'amour entre deux prénoms (.amour Nom1 Nom2)",
    categorie: "Divertissement",
    executer: async ({ sock, from, args }) => {
      if (args.length < 2) {
        await sock.sendMessage(from, {
          text: "Utilisation : .amour Prénom1 Prénom2",
        });
        return;
      }
      const pourcentage = Math.floor(Math.random() * 100) + 1;
      await sock.sendMessage(from, {
        text: `💘 ${args[0]} + ${args[1]} = ${pourcentage}% de compatibilité !`,
      });
    },
  },

  compliment: {
    description: "Envoie un compliment aléatoire",
    categorie: "Divertissement",
    executer: async ({ sock, from }) => {
      const compliments = [
        "Tu illumines la conversation ✨",
        "Ton énergie est contagieuse aujourd'hui !",
        "Tu es plus intelligent(e) que tu ne le penses.",
        "Ton sourire pourrait résoudre bien des problèmes.",
      ];
      await sock.sendMessage(from, { text: alea(compliments) });
    },
  },
};

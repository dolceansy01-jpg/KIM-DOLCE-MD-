const general = require("./general");
const groupe = require("./groupe");
const fun = require("./fun");
const outils = require("./outils");

// On fusionne toutes les catégories en un seul objet de commandes
module.exports = {
  ...general,
  ...groupe,
  ...fun,
  ...outils,
};

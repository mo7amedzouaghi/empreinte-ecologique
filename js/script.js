// ===== Projet البصمة البيئية - Lycée Oued Ellil =====
// Facteurs d'émission indicatifs (kg CO2e) - voir la page "Calculateur"
let F_ELEC = 0.47;     // par kWh
let F_EAU = 0.3;       // par m3 (valeur indicative)
let F_FEUILLE = 0.005; // par feuille A4 (valeur indicative)

function init() {
  let d = new Date();
  if (document.getElementById("annee") != null) {
    document.getElementById("annee").innerHTML = d.getFullYear();
  }
  if (document.getElementById("jours") != null) {
    afficherJours();
  }
}

function arrondi(x) {
  return Math.round(x * 10) / 10;
}

// ---------- Calculateur ----------
function afficherJours() {
  document.getElementById("jours_aff").innerHTML = document.getElementById("jours").value;
}

function champValide(id, nom) {
  let v = document.getElementById(id).value;
  if (v == "" || isNaN(Number(v)) || Number(v) < 0) {
    alert("Saisir une valeur positive pour : " + nom);
    return false;
  }
  return true;
}

function calculer() {
  let mode = document.getElementById("mode");
  if (mode.selectedIndex == 0) {
    alert("Choisir un mode de transport");
    return;
  }
  if (champValide("distance", "distance domicile-lycée") == false) {
    return;
  }
  if (champValide("elec", "électricité") == false) {
    return;
  }
  if (champValide("eau", "eau") == false) {
    return;
  }
  if (champValide("papier", "papier") == false) {
    return;
  }
  if (champValide("dechets", "déchets") == false) {
    return;
  }

  // 1) Transport : aller-retour x jours par semaine x 30 semaines
  let facteurMode = Number(mode.value);
  let distance = Number(document.getElementById("distance").value);
  let jours = Number(document.getElementById("jours").value);
  let transport = 2 * distance * jours * 30 * facteurMode;

  // 2) Énergie, eau, papier
  let energie = Number(document.getElementById("elec").value) * 12 * F_ELEC;
  let eau = Number(document.getElementById("eau").value) * 12 * F_EAU;
  let papier = Number(document.getElementById("papier").value) * 30 * F_FEUILLE;

  // 3) Déchets : 0.5 kg CO2e/kg sans tri, 0.3 avec tri
  let facteurDechets = 0.5;
  if (document.getElementById("tri_oui").checked) {
    facteurDechets = 0.3;
  }
  let dechets = Number(document.getElementById("dechets").value) * 52 * facteurDechets;

  // 4) Alimentation : forfait annuel selon la fréquence de viande
  let alim = 600;
  if (document.getElementById("viande_jour").checked) {
    alim = 1500;
  }
  if (document.getElementById("viande_semaine").checked) {
    alim = 1000;
  }

  let noms = ["Transport", "Électricité", "Eau", "Papier", "Déchets", "Alimentation"];
  let valeurs = [transport, energie, eau, papier, dechets, alim];
  let couleurs = ["#1565c0", "#f9a825", "#00acc1", "#8d6e63", "#6d4c41", "#43a047"];
  let conseils = [
    "Privilégier le vélo, la marche, le bus ou le covoiturage.",
    "Éteindre les lumières et débrancher les appareils en veille.",
    "Prendre des douches courtes et réparer les fuites.",
    "Imprimer en recto-verso et réutiliser les feuilles brouillon.",
    "Trier les déchets et réduire les emballages.",
    "Manger moins de viande et plus de légumes de saison."
  ];

  let total = 0;
  let imax = 0;
  for (let i = 0; i < 6; i++) {
    total = total + valeurs[i];
    if (valeurs[i] > valeurs[imax]) {
      imax = i;
    }
  }

  let niveau = "<span class='faible'>faible</span>";
  if (total > 2660) {
    niveau = "<span class='eleve'>élevé</span>";
  } else if (total > 1330) {
    niveau = "<span class='moyen'>moyen</span>";
  }

  let html = "<h3 class='sous3'>Votre empreinte : " + Math.round(total) + " kg CO2e par an</h3>";
  html = html + "<p>Niveau d'impact : " + niveau + " (repère : environ 2660 kg CO2/habitant/an en Tunisie, 2024).</p>";
  for (let i = 0; i < 6; i++) {
    let pct = 0;
    if (total > 0) {
      pct = Math.round(valeurs[i] / total * 100);
    }
    html = html + "<p class='ligne-bar'>" + noms[i] + " : " + Math.round(valeurs[i]) + " kg (" + pct + " %)</p>";
    html = html + "<div class='barre-fond'><div class='barre' id='b" + i + "'></div></div>";
  }
  html = html + "<p>Poste le plus important : <strong>" + noms[imax] + "</strong>. Conseil : " + conseils[imax] + "</p>";
  document.getElementById("resultat").innerHTML = html;
  document.getElementById("resultat").style.border = "2px solid #1b5e20";

  for (let i = 0; i < 6; i++) {
    let p = 0;
    if (total > 0) {
      p = Math.round(valeurs[i] / total * 100);
    }
    document.getElementById("b" + i).style.width = p + "%";
    document.getElementById("b" + i).style.background = couleurs[i];
  }
}

// ---------- Suivi du lycée ----------
function calculerSuivi() {
  let totaux = [];
  let saisis = [];
  let nb = 0;
  let somme = 0;
  let max = 0;
  for (let i = 1; i <= 9; i++) {
    let e = document.getElementById("e" + i).value;
    let w = document.getElementById("w" + i).value;
    let p = document.getElementById("p" + i).value;
    if (e == "" && w == "" && p == "") {
      totaux[i] = 0;
      saisis[i] = false;
    } else {
      if (isNaN(Number(e)) || isNaN(Number(w)) || isNaN(Number(p)) || Number(e) < 0 || Number(w) < 0 || Number(p) < 0) {
        alert("Valeur incorrecte dans la ligne " + i);
        return;
      }
      totaux[i] = Number(e) * F_ELEC + Number(w) * F_EAU + Number(p) * 500 * F_FEUILLE;
      saisis[i] = true;
      nb = nb + 1;
      somme = somme + totaux[i];
      if (totaux[i] > max) {
        max = totaux[i];
      }
    }
  }
  if (nb == 0) {
    alert("Saisir les consommations d'au moins un mois");
    return;
  }

  let premier = 0;
  let dernier = 0;
  for (let i = 1; i <= 9; i++) {
    let cell = document.getElementById("r" + i);
    let barre = document.getElementById("g" + i);
    if (saisis[i]) {
      cell.innerHTML = Math.round(totaux[i]) + " kg";
      let pct = 0;
      if (max > 0) {
        pct = Math.round(totaux[i] / max * 100);
      }
      barre.style.width = pct + "%";
      barre.style.background = "#43a047";
      if (premier == 0) {
        premier = i;
      }
      dernier = i;
    } else {
      cell.innerHTML = "—";
      barre.style.width = "0%";
    }
  }

  let html = "<h3 class='sous3'>Bilan de " + nb + " mois</h3>";
  html = html + "<p>Total : <strong>" + Math.round(somme) + " kg CO2e</strong> — moyenne mensuelle : <strong>" + Math.round(somme / nb) + " kg CO2e</strong>.</p>";
  if (premier != dernier && totaux[premier] > 0) {
    let evo = arrondi((totaux[dernier] - totaux[premier]) / totaux[premier] * 100);
    if (evo <= -10) {
      html = html + "<p><span class='faible'>Objectif atteint</span> : " + evo + " % entre le premier et le dernier mois saisi (objectif : -10 %).</p>";
    } else {
      html = html + "<p>Évolution entre le premier et le dernier mois saisi : <span class='moyen'>" + evo + " %</span> (objectif : -10 %).</p>";
    }
  }
  document.getElementById("bilan").innerHTML = html;
}

// ---------- Quiz ----------
function corriger() {
  let bonnes = ["q1a", "q2c", "q3b", "q4a", "q5c"];
  let explications = [
    "L'empreinte écologique mesure la surface nécessaire pour fournir nos ressources et absorber nos déchets.",
    "Le vélo n'émet pas de CO2 pendant le trajet.",
    "Le recto-verso divise par deux le nombre de feuilles utilisées.",
    "Le dioxyde de carbone (CO2) est le principal gaz à effet de serre émis par les activités humaines.",
    "Une bouteille en plastique vide va dans le bac de tri pour être recyclée."
  ];
  let score = 0;
  let texte = "";
  for (let i = 0; i < 5; i++) {
    if (document.getElementById(bonnes[i]).checked) {
      score = score + 1;
      texte = texte + "<p><span class='faible'>Question " + (i + 1) + " : correct.</span> " + explications[i] + "</p>";
    } else {
      texte = texte + "<p><span class='eleve'>Question " + (i + 1) + " : incorrect.</span> " + explications[i] + "</p>";
    }
  }
  let message = "Continuez à apprendre !";
  if (score == 5) {
    message = "Bravo, vous êtes un champion de l'environnement !";
  } else if (score >= 3) {
    message = "Bien joué, vous connaissez les bases.";
  }
  document.getElementById("score").innerHTML = "<h3 class='sous3'>Score : " + score + " / 5</h3><p>" + message + "</p>" + texte;
}

// ---------- Suggestion d'action ----------
function envoyerSuggestion() {
  let nom = document.getElementById("nom").value;
  let idee = document.getElementById("idee").value;
  if (nom.trim() == "" || idee.trim().length < 10) {
    alert("Saisir votre nom et une idée d'au moins 10 caractères");
    return;
  }
  document.getElementById("merci").innerHTML = "Merci ! Copiez votre idée ci-dessous et remettez-la à l'équipe du projet.";
  document.getElementById("copie").value = "Proposé par " + nom.trim() + " : " + idee.trim();
}

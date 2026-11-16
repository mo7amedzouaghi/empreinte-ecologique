# Cahier des charges – Projet « البصمة البيئية » (Empreinte écologique)

**Lycée Oued Ellil** · Responsable du projet : Mme Sonia Aouichi (professeure d'anglais)

## 1. Présentation du projet

**Intitulé :** البصمة البيئية – Mesurer, comprendre et réduire l'empreinte écologique du lycée.

**Nature :** projet interdisciplinaire et citoyen, mené au sein du lycée avec des élèves encadrés par plusieurs enseignants (anglais, informatique, SVT, physique, éducation civique, arabe/français selon disponibilité).

**Contexte :** la consommation d'énergie, d'eau et de papier, la production de déchets et les déplacements du lycée ont un impact environnemental mesurable. Le projet propose de le quantifier, de sensibiliser la communauté scolaire et de mettre en place des actions concrètes de réduction.

**Problématique :** *Quelle est l'empreinte écologique de notre lycée et comment pouvons-nous la réduire durablement ?*

## 2. Objectifs

### 2.1 Objectif général
Mesurer l'empreinte écologique du lycée (كمية الانبعاثات والموارد المستهلكة) et réduire son impact par des actions menées par les élèves.

### 2.2 Objectifs spécifiques
- **Pédagogiques :** comprendre les notions d'empreinte écologique et carbone, de ressources renouvelables, de développement durable ; pratiquer la démarche de projet (enquête, analyse, réalisation, restitution).
- **Scientifiques :** collecter des données (factures, relevés, enquêtes), les traiter, les interpréter et les représenter (tableaux, graphiques).
- **Linguistiques :** utiliser le vocabulaire de l'environnement en français, arabe et anglais (glossaire trilingue, supports en anglais).
- **Numériques :** concevoir et utiliser une application web de calcul et de suivi de l'empreinte.
- **Citoyens :** sensibiliser élèves, personnel et familles ; adopter des écogestes.
- **Mesurables (cibles proposées) :** −10 % de papier, d'électricité et d'eau sur l'année scolaire ; tri sélectif dans tout l'établissement.

## 3. Parties prenantes et rôles

| Acteur | Rôle |
|---|---|
| Direction du lycée | Autorisation, accès aux données (factures, consommations), soutien logistique |
| Enseignante d'anglais (Mme Sonia Aouichi), responsable du projet | Coordination générale, supports et interface en anglais, encadrement des élèves |
| Enseignant partenaire (SVT / physique / autre) | Contenu scientifique, méthodes de mesure, facteurs d'émission |
| Élèves – équipe Données | Collecte, saisie et analyse des données |
| Élèves – équipe Application | Utilisation et amélioration de l'application web |
| Élèves – équipe Sensibilisation | Affiches, campagnes, ateliers, communication |
| Élèves – équipe Actions | Tri sélectif, économie d'énergie et d'eau, espaces verts |
| Personnel (administration, agents, cantine) | Fournir les informations, appliquer les mesures |
| Partenaires externes (association, commune…) | Conseil, intervention, collecte de recyclables (optionnel) |

**Comité de pilotage :** direction + enseignants + un délégué par équipe, réunion mensuelle.

## 4. Périmètre

**Inclus :** énergie (électricité, chauffage), eau, papier et fournitures, déchets, déplacements domicile-lycée, restauration (si cantine).

**Exclus (version 1) :** analyse complète du cycle de vie des équipements et bâtiments.

## 5. Activités et tâches

### Phase 1 – Lancement et sensibilisation
- Présentation du projet aux classes et au personnel.
- Constitution des équipes et désignation des responsables.
- Séance d'introduction : notion d'empreinte écologique et carbone (exposé, vidéo, débat).
- Définition de la charte du projet et de l'identité visuelle (logo, slogan).

### Phase 2 – Diagnostic (collecte des données)
- Relever les consommations d'électricité et d'eau (factures STEG / SONEDE, compteurs).
- Estimer la consommation de papier (photocopies, administration).
- Mesurer les déchets : pesée par catégorie sur une semaine type.
- Enquête par questionnaire auprès des élèves et du personnel : mode de transport, distance, habitudes.
- Saisie des données dans l'application (page « Suivi du lycée »).

### Phase 3 – Analyse
- Convertir les consommations en empreinte à l'aide de facteurs d'émission fiables (source citée).
- Calculer l'empreinte totale et par catégorie, par élève.
- Représenter par graphiques ; identifier les postes les plus impactants.
- Rédiger un rapport de diagnostic et le présenter à la direction.

### Phase 4 – Application web
- Prise en main et tests de l'application par les élèves ; recueil des améliorations.
- Mise en ligne (GitHub Pages) ou utilisation en local sur le réseau du lycée.

### Phase 5 – Plan d'actions
- Atelier de propositions : écogestes, tri sélectif, extinction des lumières, économie d'eau, zéro papier, covoiturage/vélo, composteur.
- Priorisation (impact / coût / faisabilité) et plan d'actions daté avec responsables.
- Mise en œuvre : poubelles de tri, affichage des consignes, campagnes, journée verte.

### Phase 6 – Suivi, évaluation et restitution
- Nouvelles mesures en fin de projet ; comparaison avec l'état initial.
- Journée de restitution : exposition, présentation, démonstration de l'application.
- Bilan et recommandations pour l'année suivante.

## 6. Application web

Dépôt : https://github.com/mo7amedzouaghi/empreinte-ecologique

### 6.1 Fonctionnalités
1. **Accueil :** présentation du projet, objectifs, équipe.
2. **Calculateur d'empreinte personnelle :** transport, énergie, eau, papier, déchets, alimentation ; résultat en direct, graphique en anneau, niveau d'impact, équivalent en arbres, historique, impression du rapport.
3. **Suivi du lycée :** saisie mensuelle, graphique avec objectif −10 %, export et import CSV.
4. **Défis écologiques :** liste de défis avec points et badges.
5. **Quiz :** 6 questions avec explications.
6. **Glossaire trilingue** (français, arabe, anglais) avec recherche.

### 6.2 Contraintes
- Interface en **français, arabe (droite à gauche) et anglais**.
- Adaptée aux téléphones et ordinateurs, thème clair/sombre, accessible au clavier.
- Site statique, sans serveur ni dépendance externe ; données conservées dans le navigateur.

### 6.3 Formules de calcul
Empreinte = quantité consommée × facteur d'émission (kg CO2e).

| Poste | Facteur | Source / remarque |
|---|---|---|
| Électricité | 0,47 kg/kWh | Réseau tunisien (IEA) |
| Voiture essence | 0,218 kg/km | ADEME |
| Moto ≤ 125 cm³ | 0,113 kg/km | ADEME |
| Bus / louage | 0,146 kg/km | ADEME |
| Eau | 0,3 kg/m³ | Valeur indicative, à valider |
| Papier | 0,005 kg/feuille | Valeur indicative, à valider |
| Déchets | 0,5 kg/kg (0,3 avec tri) | Valeur pédagogique, à valider |
| Alimentation | 1500 / 1000 / 600 kg/an | Forfaits pédagogiques |

## 7. Planning prévisionnel (année scolaire)

| Phase | Période indicative |
|---|---|
| 1. Lancement et sensibilisation | Novembre |
| 2. Diagnostic (collecte) | Décembre – Janvier |
| 3. Analyse | Janvier – Février |
| 4. Application web | Décembre – Mars (en parallèle) |
| 5. Plan d'actions et mise en œuvre | Février – Avril |
| 6. Mesures finales et restitution | Mai (journée de l'environnement) |

## 8. Livrables
- Charte et identité visuelle du projet (logo).
- Fichier de données (consommations, enquête) et rapport de diagnostic.
- Application web fonctionnelle.
- Supports de sensibilisation (affiches, flyers, présentation).
- Plan d'actions et rapport de bilan final.
- Exposition / journée de restitution.

## 9. Moyens nécessaires
- **Humains :** enseignants encadrants, élèves volontaires, accord de la direction.
- **Matériels :** salle informatique, balance, poubelles de tri, matériel d'impression.
- **Budget indicatif :** impression, bacs de tri, plantes/composteur – à valider par la direction (coopérative scolaire, partenaires).

## 10. Indicateurs de réussite
- Nombre d'élèves impliqués et d'enquêtes remplies.
- Réduction mesurée des consommations (papier, électricité, eau) par rapport à l'état initial.
- Quantité de déchets triés.
- Application utilisée (nombre de calculs effectués).
- Nombre d'actions de sensibilisation réalisées.

## 11. Évaluation des élèves
- Évaluation formative des tâches d'équipe (participation, qualité, respect des délais).
- Évaluation du produit (rapport, présentation orale, actions menées).
- Évaluation individuelle de l'engagement (carnet de bord du projet).

## 12. Risques et solutions

| Risque | Parade |
|---|---|
| Données de consommation indisponibles | Anticiper la demande à l'administration ; utiliser des estimations documentées |
| Manque de temps / emploi du temps chargé | Séances planifiées dès le début, rôles clairs, plages fixes hebdomadaires |
| Baisse de motivation | Valorisation (défis, badges, journée verte), retours réguliers |
| Écarts de niveau | Binômes mixtes, tutorat, tâches adaptées |
| Facteurs d'émission contestables | Source officielle citée, validation par l'enseignant scientifique |

## 13. Validation

| Rôle | Nom | Date et signature |
|---|---|---|
| Responsable du projet | Mme Sonia Aouichi | |
| Enseignant partenaire | | |
| Directeur du lycée | | |

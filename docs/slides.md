---
title: "Une interface pour adresser la partition musicale"
institute: "Réunion d'avancement *Tonalities*"
theme: Rochester
aspectratio: 169
header-includes: |
 \titlegraphic{\includegraphics[width=2cm]{assets/tonalities.pdf}}
 \logo{\includegraphics[width=2cm]{assets/polifonia.pdf}}
---

# Interface d'adressage
- La partition sélectionnée à gauche
- Le panneau latéral à droite

![Interface d'adressage de la partition](assets/landing.png)

# Deux modes d'interaction complémentaires
- Le mode **inspection** permet de cibler un élément particulier et de consulter ses métadonnées
- Le mode **sélection** permet de constituer un groupe d'éléments

# Trois types d'élements unitaires à sélectionner ou à inspecter sur une partition
- Une **note** (unité structurelle)
- Une **verticalité** (unité temporelle)
- Une **note positionnée** (conjonction d'une note et d'une verticalité)

![Création d'une sélection nommée à partir d'éléments unitaires sur la partition](assets/firstSelection.png)

# Des sélections modifiables et réemployables
Les sélections regroupent des composants de la partition mais peuvent aussi réemployer des sélections déjà existantes.

![Création d'une sélection nommée à partir d'une sélection précédente et d'éléments de la partition](assets/reuseSelection.png)

# À venir
- À partir de ces sélections il sera possible de créer des **annotations**, c'est à dire
	- dire quelque-chose à propos des éléments séléctionnnés...
	- ...dans des termes provenant d'un modèle théorique spécifique

# Création de sélections d'éléments sur la partition

- Ce qu'on veut pouvoir sélectionner les éléments suivants :
    - une note
    - une verticalité
    - le « croisement » entre une note et une verticalité
    - les silences
- Une sélection peut contenir :
    - n'importe quel nombre de ces éléments
    - n'importe quel nombre de sélections
- Il faut pouvoir (re)nommer une sélection, et le système doit proposer un nom par défaut (peut-être inspiré du numéro de mesure ?).
- On doit pouvoir éditer le contenue d'une sélection (contenu = éléments + sélections enfants) à tout moment, sans en changer l'URL.
- Il faut pouvoir supprimer une sélection, sans supprimer ses sélections enfant. Le serveur doit rejeter une demande de suppression de sélection si elle est contenue dans une autre. Entre deux sélections existe un rapport d'agrégation et non de composition (le cycle de vie de la sélection enfant n'est pas déterminée par le cycle de vie de la sélection parent).
- Il faut pouvoir créer une nouvelle sélection à partir d'une sélection existante (et ainsi lui ajouter des trucs). À partir du mode consultation.

# TODO côté preprocessing données

- extraire les numéros de mesure
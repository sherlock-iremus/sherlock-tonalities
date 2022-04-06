# Tonalities, a Polifonia pilot project

*Tonalities is developing tools for the modal-tonal identification, exploration and classification of monophonic and polyphonic notated music from the Renaissance to the 20th century. The pilot has a broader societal and pedagogical dimension: it does not only impact research on the theory and evolution of the musical language but is also relevant for the understanding of music collections by students, performers, and informed music lovers. The recording industry is a potential target for the classification of works and the constitution of playlists.*

![](docs/assets/landing.png)

### Two complementary interaction modes
- **Inspection** mode allows to pick a specific element from the score and view its metadatas.
- **Sélection** mode allows to agregate elements which form a selection.

### Three element types to be selected or inspected from the score
- A **note** (structural unit)
- A **verticality** (temporal unit)
- A **positioned note** (conjunction between a note and a verticality)

![](docs/assets/firstSelection.png)

### Selections can be edited and reused
Selections regroup elements from the score but can also reuse previous selections.

![](docs/assets/reuseSelection.png)

## Todo
### Adressage de la partition
- [x] extraire les numéros de mesure
- [x] Ce qu'on veut pouvoir sélectionner les éléments suivants :
    - une note
    - une verticalité
    - le « croisement » entre une note et une verticalité
    - les silences **(TODO ?)**
- [x] Une sélection peut contenir :
    - n'importe quel nombre de ces éléments
    - n'importe quel nombre de sélections
- [x] Il faut pouvoir (re)nommer une sélection, et le système doit proposer un nom par défaut (peut-être inspiré du numéro de mesure ?).
- [x] On doit pouvoir éditer le contenue d'une sélection (contenu = éléments + sélections enfants) à tout moment, sans en changer l'URL.
- [x] Il faut pouvoir créer une nouvelle sélection à partir d'une sélection existante (et ainsi lui ajouter des trucs). À partir du mode consultation.
- [ ] Il faut pouvoir supprimer une sélection, sans supprimer ses sélections enfant. Le serveur doit rejeter une demande de suppression de sélection si elle est contenue dans une autre. Entre deux sélections existe un rapport d'agrégation et non de composition (le cycle de vie de la sélection enfant n'est pas déterminée par le cycle de vie de la sélection parent).
### Annotation de la partition
- [ ] ...
- [ ] ...
- [ ] ...
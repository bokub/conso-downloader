# Conso Downloader

[![Chrome users](https://flat.badgen.net/chrome-web-store/users/geldaniiglcfekimaghpdiiabjaflllp?label=chrome%20users&color=green)](https://chromewebstore.google.com/detail/conso-downloader/geldaniiglcfekimaghpdiiabjaflllp)

> Téléchargez vos données Linky en un clic

## À quoi ça sert

**Conso Downloader** est une extension pour Google Chrome vous permettant de **télécharger tout votre historique de consommation électrique par demi-heure**, au format CSV, en un seul clic.

En effet, le site d’Enedis ne permet pas de récupérer l'intégralité de vos données, il faut le faire **semaine par semaine**, ce qui rend la tâche longue et fastidieuse.

## Comment l'utiliser

<img align="right" src="https://github.com/user-attachments/assets/d66e5bfb-0c75-4c31-a5af-cca17f4961c7" width="200"/>

1. Installez l’extension depuis le [Chrome Web Store](https://chromewebstore.google.com/detail/conso-downloader/geldaniiglcfekimaghpdiiabjaflllp)
2. Rendez-vous sur votre espace client Enedis, dans la section [Suivre ma consommation](https://mon-compte-particulier.enedis.fr/visualiser-vos-mesures-consommation) (ou production)
3. Un **nouveau bouton gris** apparaît en bas à gauche de la page avec le texte **Télécharger tout mon historique**
4. Sélectionnez l’option **Courbe de charge (kW)** dans le sélecteur à droite de la période
5. Le bouton devient alors **bleu** et cliquable
6. Cliquez dessus, patientez quelques secondes : **votre fichier CSV** contenant tout votre historique sera téléchargé automatiquement

## Détails techniques

- Le fichier téléchargé est au format **CSV**, avec un séparateur point-virgule (`;`) et un séparateur décimal virgule (`,`)
- L’extension n’envoie **aucune donnée vers un service externe** : tout se passe directement dans votre navigateur

---

_Conso Downloader n’est pas affiliée à Enedis._  
_C’est un outil open-source et indépendant destiné à simplifier l’accès à **vos** propres données._

_Cette extension existe parce qu’il n’existe aujourd’hui **aucun moyen de récupérer l’intégralité de ses données auprès d’Enedis**, y compris via une demande écrite, en dépit des obligations prévues par le RGPD._

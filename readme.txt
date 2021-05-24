Projet de création d'un atlas linguistique des formes pour le GPSR
But : Valorisation des variantes phonétiques
Projet réalisé dans le cadre du cours Unige-DH-Visualisation
@author : Fabrice Camus

Version 1.0
- Dataset : liste des formes géo-précises pour le lemme FROMAGE au format JSON
- Affichage des formes sur la carte, avec la bonne typographie (selon la langue)
- Pour chaque forme, affiche d'une icone "i" ouvrant une popup contenant la localisation de la forme
- Cluster pour les formes au même emplacement
- Contour des cantons romands (source geojson)

Version 2.0
- Mise en place de layerGroup/LayerContol pour les langues (nécessite le sous plugin leaflet.markercluster.layersupport)
 
Version 3.0
- Dataset : liste des formes géo-vagues pour le lemme FROMAGE au format JSON        
- Affichage des formes dans une popup d'un marker par canton, avec la bonne typographie (selon la langue)

Version 4.0
- Icone pour chaque canton (drapeau)
- Choix de l'affichage des noms de lieux
- Affinage des CSS



Améliorations possibles:
- Délimiter la zone du Jura Bernois francophone au lieu d'avoir tout le canton de Berne (--> refaire geoJson)
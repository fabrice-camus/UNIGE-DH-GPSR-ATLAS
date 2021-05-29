# UNIGE-DH-GPSR-ATLAS

Prototype d'atlas linguistique des formes pour le Glossaire des patois de la Suisse romande

But : Valorisation des variantes phonétiques

Projet réalisé dans le cadre du cours Unige-DH-Visualisation


## Contenu

* Affichage des variantes phonétiques du lemme FROMAGE
* Les formes "géo-précises" :
	* sont affichées à leur emplacement géographique
	* leur localisation est affichable dans une info-bulle sur l'icône "i"
	* sont regroupées dans un "cluster" pour un même emplacement géographique
* Les formes dont la précision géographique est inconnue) sont affichables en cliquant sur le drapeau cantonal
* Les langues des formes servent de critères d'affichage dans un tableau de contrôle en haut à droite de la carte

Le prototype est développé :
* en html/css/javascript
* avec la libraire [Leaflet](https://leafletjs.com/)
* avec les plugins (disponibles dans la liste des plugins [Leaflet](https://leafletjs.com/))  : 
	* Leaflet.markercluster-1.4.1
	* leaflet.markercluster.layersupport.js
* les données sont fournies par le GPSR et proviennent de la liste des formes du lemme FROMAGE (au format JSON)
* les frontières cantonales (geoJSON) proviennent du dépot github de [zdavatz](https://github.com/zdavatz/covid19_ch/tree/master/assets)
  

Démo en ligne [ici](https://fabrice-camus.github.io/UNIGE-DH-GPSR-ATLAS/Fromage.html)


## Licences
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Licence Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />Mes fichiers sources sont sous licence <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International Licence</a>.

Les données du GPSR sont propriétés exclusives du Glossaire des patois de la Suisse romande et ne peuvent être exploitées de quelconque manière (droits d'auteur)



Leaflet.markercluster is free software, and may be redistributed under the MIT-LICENSE.
[![license](https://img.shields.io/github/license/ghybs/leaflet.markercluster.layersupport.svg)](LICENSE)

Leaflet.MarkerCluster.LayerSupport is distributed under the
[MIT License](http://choosealicense.com/licenses/mit/) (Expat type), like
Leaflet.markercluster.


## Citer ce repository
Fabrice Camus,  _UNIGE-DH-GPSR-ATLAS: Prototype d'atlas linguistique des formes du GPSR_, Genève: Université de Genève, 2020, [https://github.com/fabrice-camus/UNIGE-DH-GPSR-ATLAS](https://github.com/fabrice-camus/UNIGE-DH-GPSR-ATLAS).


## Contact
fabrice.camus[at]etu.unige.ch
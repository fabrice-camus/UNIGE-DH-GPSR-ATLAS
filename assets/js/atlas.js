/*
Fabrice Camus
Fonctions javascript nécessaires à l'atlas linguistique
Projet : Unige - DH - Visualisation - SP 2021
*/

// Fonction d'initialisation de la carte
window.onload = function () {
	initMap();
};


function initMap() {
	//Coordonnées du centre géographique de la Suisse Romande (Moudon)
	var initLat = 46.6680664;
	var initLong = 6.8003478;
	var initZoom = 9;
	var GPSRMap = null;

	//Récupère les formes riches "geo-précises"
	var formesRichesPrecises = getData("../../data/formesRichesPrecises.json")

	//Paramétrage initial de la carte
	GPSRMap = L.map('map').setView([initLat, initLong], initZoom);
	GPSRMap.createPane('labels');
		
	//Tiles
	L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
		attribution: '©OpenStreetMap, ©CartoDB'
	}).addTo(GPSRMap);

	L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
		attribution: '©OpenStreetMap, ©CartoDB'
	}).addTo(GPSRMap);

	
	//Les frontières cantonales proviennent de
	//https://github.com/zdavatz/covid19_ch/tree/master/assets
	var cantonsBoundaries = [cantonsGeoJSON];
	L.geoJSON(cantonsBoundaries).addTo(GPSRMap);
	


	/* Création des cluster
		maxClusterRadius:0 --> permet de ne regrouper que les formes d'un même point !
		zoomToBoundsOnClick est "sans effet" du coup
	*/
	var markersGroup = L.markerClusterGroup.layerSupport({
		spiderfyOnMaxZoom: true,
		showCoverageOnHover: false, 
		zoomToBoundsOnClick: false,
		removeOutsideVisibleBounds:false,
		spiderfyDistanceMultiplier:6,
		maxClusterRadius:0,
		iconCreateFunction: function (cluster) {
		  //On recrée l'icone en forcant le style css pour n'avoir qu'une seule couleur
		  return new L.DivIcon({
			html: '<div><span>' + cluster.getChildCount() + '</span></div>',
			className: 'marker-cluster  marker-cluster-medium', iconSize: new L.Point(40, 40)
		  })
		},
		
	});

	/*  Icone information. Permet de voir où il faut cliquer, sinon impossible car 
		le point clicable n'est pas visible. En plus, avec la forme affichée si grande
		on ne sait pas vraiment où elle est géographiquement placée
	*/
	var informationIcon = L.icon({
		iconUrl: './assets/img/info-solid.svg',  
		iconSize:     [15, 15],
		iconAnchor:   [10, 20],
		tooltipAnchor:  [40, -40]
	});

	// Création de groupLayer pour les langues
	// La liste des langues pour les formes est fixe.
	var layerPatois = L.layerGroup();
	var layerAncienPatois = L.layerGroup();
	var layerFrancaisRegional = L.layerGroup();
	var layerAncienFrancaisRegional = L.layerGroup();
	var layerLatin = L.layerGroup();
	var languesChoose = {
		"Patois": layerPatois,
		"Ancien patois":layerAncienPatois,
		"Français régional":layerFrancaisRegional,
		"Ancien français régional":layerAncienFrancaisRegional,
		"Latin":layerLatin
	};
	L.control.layers(null,languesChoose).addTo(GPSRMap);


	// Création des markers/cluster 
	for (var forme of formesRichesPrecises.lesformes) {
		//Création du Marker
		var marker = L.marker([forme.LATITUDE, forme.LONGITUDE], {icon:informationIcon,opacity: 0.4, });
		//Génére la popup 
		marker.bindPopup(forme.LOCALISATION);
		//Génère l'étiquette de la forme riche. Le paramètre "permanent" consiste à laisser l'étiquette en permanence sur la carte
		marker.bindTooltip(forme.FORMERICHE,
		  {
			permanent: true,
			direction: 'center'
		  });
		//Ajout le marker dans le cluster
		markersGroup.addLayer(marker);
		
		//Ajout dans les layer de langues.
		//En utilisant le sous-plugin leaflet.markercluster.layersupport, les clusters sont dynamiquement ajustés
		switch (forme.LIENPROGLANGUE) {
		  case 'PAT':
			layerPatois.addLayer(marker);
			break;
		  case 'ANCPAT':
			layerAncienPatois.addLayer(marker);
			break;
		  case 'FRAREG':
			layerFrancaisRegional.addLayer(marker);
			break;
		  case 'ANCFRAREG':
			layerAncienFrancaisRegional.addLayer(marker);
			break;
		  case 'LAT':
			layerLatin.addLayer(marker);
			break;

		}
		
	}
	
	//Ajoute les différents layers dans la map
	GPSRMap.addLayer(markersGroup);
	GPSRMap.addLayer(layerPatois);
	GPSRMap.addLayer(layerAncienPatois);
	GPSRMap.addLayer(layerFrancaisRegional);
	GPSRMap.addLayer(layerAncienFrancaisRegional);
	GPSRMap.addLayer(layerLatin);

	

	
	
}

//Fonction qui récupère des données json
function getData(file) {
	
	var xmlhttp = new XMLHttpRequest();
	var datas;
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			datas = JSON.parse(this.responseText);
		}
	};
	xmlhttp.open("GET", file, false);
	xmlhttp.send();

	return datas;
}

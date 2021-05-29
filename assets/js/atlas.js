/*
Fabrice Camus
Script de création de l'Atlas
Projet : Unige - DH - Visualisation - SP 2021
*/

//Variables globales

//Récupère les formes riches "geo-précises"
var formesRichesPrecises = getData("data/formesRichesPrecises.json");
//Récupère les formes riches "geo-vagues"
var formesRichesVagues = getData("data/formesRichesVagues.json");
//Map qui va contenir l'état actif (true/false) pour les layers de languge
var activeLayersLangues = new Map();


// Fonction d'initialisation de la carte
window.onload = function () {
	initMap();
};

//Retourne les formes vagues par canton (qu'on cherche par la latitude)
function getFormesCantonByLat(lat){
	for(var leCanton of formesRichesVagues.cantons){
		if (leCanton.LATITUDE==lat) return leCanton.lesformes;
	}
}


//Alimente le popup du Canton avec les formes en tenant compte des layers de langues activées
function onMarkerClick(e) {
	//Cherche le canton dans les datas JSON par la latitude (il n'y a pas d'ID dans les marker)
	var lat=e.sourceTarget.getLatLng().lat;
	
	var popupContent="<p><i>Formes dont la localisation n'est pas précise</i></p>";
	var formesStr="";
	for(var forme of getFormesCantonByLat(lat)){
		
		if(activeLayersLangues.get(forme.LANGUE)){
			popupContent=popupContent.concat("<p>",forme.FORMERICHE," - ",forme.LOCALISATION,"</p>");
			
		}
	}
	
	e.target.getPopup().setContent(popupContent);
	e.target.getPopup().update();
	
}


function initMap() {
	//Coordonnées du centre géographique de la Suisse Romande (Moudon)
	var initLat = 46.6680664;
	var initLong = 6.8003478;
	var initZoom = 9;
	var GPSRMap = null;

	//Map qui va contenir les icônes des cantons
	var iconsCantons = new Map();
	

	//Tiles
	var tileWithLabel = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	});
	
	var tileWithNoLabel = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 	contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
		});

	//Paramétrage initial de la carte
	GPSRMap = L.map('map', {center:[initLat, initLong], zoom:initZoom,zoomSnap:0.25,zoomDelta: 0.25,wheelPxPerZoomLevel:100,layers:[tileWithLabel]});
	
	GPSRMap.createPane('labels');
	
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
	//Création du choix de tile
	var baseTile = {
		"Avec noms de lieu": tileWithLabel,
		"Sans noms de lieu": tileWithNoLabel
	};
	L.control.layers(baseTile,languesChoose).addTo(GPSRMap);


	/* 
		Formes géo-précises
		Création des markers/cluster 
	*/
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
	
	//Journalise l'état d'activation des layers pour les langues
	GPSRMap.on({
		overlayadd: function(e) {
			 activeLayersLangues.set(e.name.toLowerCase(),true);
			},
		overlayremove: function(e) {
			activeLayersLangues.set(e.name.toLowerCase(),false);
			}
		});
	
	
	/* 
		Formes géo-vagues
		Création des markers
	*/
	for (var canton of formesRichesVagues.cantons) {
		var codeCanton=canton.CODE.toLowerCase();
		var icon = L.icon({
			iconUrl: '/assets/img/'+codeCanton+'.svg',  
			iconSize:     [50, 50],
			iconAnchor:   [0, 0],			
		});
		iconsCantons.set(codeCanton,icon);

	}
	
	for (var canton of formesRichesVagues.cantons) {
		//Création du Marker pour le canton
		var iconC= iconsCantons.get(canton.CODE.toLowerCase());
		var marker = L.marker([canton.LATITUDE, canton.LONGITUDE], {icon:iconC,opacity: 1 });
		GPSRMap.addLayer(marker);
		
		marker.on('click', onMarkerClick);
		
		//Génére la popup + augment la largeur max pour afficher chaque forme sur une ligne
		marker.bindPopup(null,{maxWidth:500});		
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

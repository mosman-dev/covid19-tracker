let map;
let infoWindow;
let mapCircles = [];
let mapCenter = { lat: 22, lng: 0 };

function initMap() {
	map = L.map('map', {
		center: [mapCenter.lat, mapCenter.lng],
		zoom: 2,
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
}

const changeCountrySelection = (countryCode) => {
	if (countryCode !== countrySelection) {
		if (countryCode == worldwideSelect.value) {
			getWorldCovidData(countryCode);
		} else {
			getCountryCovidData(countryCode);
		}
		countrySelection = countryCode;
	}
};

const changeDataSelection = (casesType) => {
	setSelectedTab(casesType);
	changeMapTitle(casesType);
	clearTheMap();
	showDataOnMap(covidGlobalData, casesType);
	let chartData = buildChartData(covidHistoricalData, casesType);
	updateData(
		chartData,
		casesTypeColors[casesType].rgb,
		casesTypeColors[casesType].half_op
	);
};

const changeMapTitle = (casesType) => {
	let casesText = casesType.charAt(0).toUpperCase() + casesType.slice(1);
	document.querySelector(
		'.map-header .component-title'
	).textContent = `COVID-19 Map of ${casesText}`;
	document.querySelector(
		'.chart-container .cases-type'
	).textContent = casesText;
};

const updateDate = (dateTimestamp) => {
	let date = moment(dateTimestamp).format('[Last Updated] MMMM DD, YYYY');
	document.querySelector('.map-header .update-date').textContent = date;
};

const clearTheMap = () => {
	for (let circle of mapCircles) {
		map.removeLayer(circle);
	}
};

const setSelectedTab = (casesType) => {
	const tabs = document.querySelectorAll('.stat-card');
	for (let tab of tabs) {
		tab.classList.remove('selected');
	}
	const activeTab = document.querySelector(`#${casesType}`);
	activeTab.classList.add('selected');
};

const setMapCountryCenter = (lat, long, zoom) => {
	map.setView([lat, long], zoom);
};

const openInfoWindow = () => {
	infoWindow.open(map);
};

const showDataOnMap = (data, casesType = 'cases') => {
	data.map((country) => {
		let countryCenter = {
			lat: country.countryInfo.lat,
			lng: country.countryInfo.long,
		};

		let circle = L.circle([countryCenter.lat, countryCenter.lng], {
			color: casesTypeColors[casesType].hex,
			fillColor: casesTypeColors[casesType].hex,
			fillOpacity: 0.4,
			radius:
				Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier,
		}).addTo(map);

		let html = `
            <div class="info-container">
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-cases">
                    Cases: ${numeral(country.cases).format('0,0')}
                </div>
                <div class="info-recovered">
                    Recovered: ${numeral(country.recovered).format('0,0')}
                </div>
                <div class="info-deaths">   
                    Deaths: ${numeral(country.deaths).format('0,0')}
                </div>
            </div>
        `;

		circle.bindPopup(html);
		mapCircles.push(circle);
	});
};

// Map Styles

var mapStyle = [
	{
		elementType: 'geometry',
		stylers: [
			{
				color: '#B2A4A4',
			},
		],
	},
	{
		elementType: 'labels.icon',
		stylers: [
			{
				visibility: 'off',
			},
		],
	},
	{
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#616161',
			},
		],
	},
	{
		elementType: 'labels.text.stroke',
		stylers: [
			{
				color: '#f5f5f5',
			},
		],
	},
	{
		featureType: 'administrative.land_parcel',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#bdbdbd',
			},
		],
	},
	{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [
			{
				color: '#eeeeee',
			},
		],
	},
	{
		featureType: 'poi',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#757575',
			},
		],
	},
	{
		featureType: 'poi.park',
		elementType: 'geometry',
		stylers: [
			{
				color: '#e5e5e5',
			},
		],
	},
	{
		featureType: 'poi.park',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#9e9e9e',
			},
		],
	},
	{
		featureType: 'road',
		stylers: [
			{
				visibility: 'off',
			},
		],
	},
	{
		featureType: 'road',
		elementType: 'geometry',
		stylers: [
			{
				color: '#ffffff',
			},
		],
	},
	{
		featureType: 'road.arterial',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#757575',
			},
		],
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry',
		stylers: [
			{
				color: '#dadada',
			},
		],
	},
	{
		featureType: 'road.highway',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#616161',
			},
		],
	},
	{
		featureType: 'road.local',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#9e9e9e',
			},
		],
	},
	{
		featureType: 'transit.line',
		elementType: 'geometry',
		stylers: [
			{
				color: '#e5e5e5',
			},
		],
	},
	{
		featureType: 'transit.station',
		elementType: 'geometry',
		stylers: [
			{
				color: '#eeeeee',
			},
		],
	},
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [
			{
				color: '#F3F2F8',
			},
		],
	},
	{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [
			{
				color: '#9e9e9e',
			},
		],
	},
];

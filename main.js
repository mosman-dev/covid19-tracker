let covidGlobalData;
let covidHistoricalData;
let countrySelection = 'worldwide';
let worldwideSelect = {
	name: 'Worldwide',
	value: 'worldwide',
	selected: true,
};

// Custom Coloring
let casesTypeColors = {
	cases: {
		hex: '#d4a45c',
		rgb: 'rgb(212, 164, 92)',
		half_op: 'rgba(212, 164, 92, 0.5)',
		multiplier: 800,
	},
	recovered: {
		hex: '#61c95e',
		rgb: 'rgb(97, 201, 94)',
		half_op: 'rgba(97, 201, 94, 0.5)',
		multiplier: 1200,
	},
	deaths: {
		hex: '#d33114',
		rgb: 'rgb(211, 49, 20)',
		half_op: 'rgba(211, 49, 20, 0.5)',
		multiplier: 2000,
	},
};

// Initialize
window.onload = () => {
	initMap();
	getCountriesData();
	getHistoricalData();
	getWorldCovidData();
};

// Dropdown
let dataList = document.querySelector('#countries');

const dropdownInit = (data) => {
	data.forEach((option) => {
		dataList.innerHTML += `<option value="${option.value}">${option.name}</option>`;
	});
};

dataList.addEventListener('change', (e) => {
	changeCountrySelection(e.target.value);
});

// Country Data

const getCountriesData = () => {
	fetch('https://disease.sh/v3/covid-19/countries')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			covidGlobalData = data;
			setCountrySelection(data);
			showDataOnMap(data);
			let sortedData = sortData(data);
			showDataInTable(sortedData);
		});
};

const sortData = (data) => {
	let sortedData = [...data];
	sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
	return sortedData;
};

const setCountrySelection = (data) => {
	let countries = [];
	countries.push(worldwideSelect);
	data.forEach((country) => {
		countries.push({
			name: country.country,
			value: country.countryInfo.iso2,
		});
	});
	dropdownInit(countries);
};

const getCountryCovidData = (countryCode) => {
	const url = `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true`;
	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			updateDate(data.updated);
			setStatsData(data);
			setMapCountryCenter(data.countryInfo.lat, data.countryInfo.long, 5);
		});
};

const getWorldCovidData = () => {
	fetch('https://disease.sh/v3/covid-19/all')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			updateDate(data.updated);
			setStatsData(data);
			setMapCountryCenter(mapCenter.lat, mapCenter.lng, 2);
		});
};

const setStatsData = (data) => {
	let addedCases = document.querySelector('.card-cases-delta');
	let addedRecovered = document.querySelector('.card-recovered-delta');
	let addedDeaths = document.querySelector('.card-deaths-delta');
	let totalCases = document.querySelector('.card-cases-total');
	let totalRecovered = document.querySelector('.card-recovered-total');
	let totalDeaths = document.querySelector('.card-deaths-total');

	counterAnimation(data.todayCases, addedCases, 500, true);
	counterAnimation(data.todayRecovered, addedRecovered, 500, true);
	counterAnimation(data.todayDeaths, addedDeaths, 500, true);
	counterAnimation(data.cases, totalCases, 500, false);
	counterAnimation(data.recovered, totalRecovered, 500, false);
	counterAnimation(data.deaths, totalDeaths, 500, false);
};

const getHistoricalData = () => {
	fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			covidHistoricalData = data;
			let chartData = buildChartData(data, 'cases');
			buildChart(chartData);
		});
};

const showDataInTable = (data) => {
	let html = '';
	data.forEach((country) => {
		html += `
        <tr>
            <td>${country.country}</td>
            <td class="table-cases-number" >${numeral(country.cases).format(
							'0,0'
						)}</td>
        </tr>
        `;
	});
	document.getElementById('table-data').innerHTML = html;
};

// Counter Animation
const counterAnimation = (cases, element, speed, format) => {
	let startingPoint;

	// If 0 cases, set and print startPoint at 0
	cases - speed < 0
		? (startingPoint = cases / 2)
		: (startingPoint = cases - speed);

	if (startingPoint === 0) {
		format
			? (element.innerHTML = numeral(startingPoint).format('+0,0'))
			: (element.innerHTML = numeral(startingPoint).format('0,0'));
		return;
	}

	// Run Animation Interval
	const runAnimation = setInterval(() => {
		if (startingPoint <= cases && format == false) {
			element.innerHTML = numeral(startingPoint).format('0,0');
			startingPoint++;
		} else if (startingPoint <= cases && format == true) {
			element.innerHTML = numeral(startingPoint).format('+0,0');
			startingPoint++;
		} else {
			clearInterval(runAnimation);
			return;
		}
	}, 1);
};

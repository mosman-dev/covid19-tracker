let chart;

const buildChartData = (data, casesType) => {
	let chartData = [];
	let lastDataPoint;
	for (let date in data.cases) {
		if (lastDataPoint) {
			let newDataPoint = {
				x: date,
				y: data[casesType][date] - lastDataPoint,
			};
			chartData.push(newDataPoint);
		}
		lastDataPoint = data[casesType][date];
	}
	return chartData;
};

const updateData = (data, borderColor, backgroundColor) => {
	chart.data.datasets[0].data = data;
	chart.data.datasets[0].borderColor = borderColor;
	chart.data.datasets[0].backgroundColor = backgroundColor;
	chart.update({
		duration: 800,
		easing: 'easeInOutCubic',
	});
};

const buildChart = (chartData) => {
	var timeFormat = 'MM/DD/YY';
	var ctx = document.getElementById('myChart').getContext('2d');
	chart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [
				{
					backgroundColor: 'rgba(212, 164, 92, 0.5)',
					borderColor: '#c7a167',
					data: chartData,
				},
			],
		},

		// Configuration
		options: {
			legend: {
				display: false,
			},
			elements: {
				point: {
					radius: 0,
				},
			},
			maintainAspectRatio: false,
			tooltips: {
				mode: 'index',
				intersect: false,
				callbacks: {
					label: function (tooltipItem, data) {
						return numeral(tooltipItem.value).format('+0,0');
					},
				},
			},
			scales: {
				xAxes: [
					{
						type: 'time',
						time: {
							parser: timeFormat,
							tooltipFormat: 'll',
						},
					},
				],
				yAxes: [
					{
						gridLines: {
							display: false,
						},
						ticks: {
							callback: function (value, index, values) {
								return numeral(value).format('0a');
							},
						},
					},
				],
			},
		},
	});
};

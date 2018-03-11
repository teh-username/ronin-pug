const colors = [
  'rgb(255, 99, 132)', // red
  'rgb(255, 159, 64)', // orange
  'rgb(255, 205, 86)', // yellow
  'rgb(75, 192, 192)', // green
  'rgb(54, 162, 235)', // blue
  'rgb(201, 203, 207)', // grey
  'rgb(153, 102, 255)' // purple
];

const baseDatasetGenerator = () => {
  let curColor = 1;
  const length = colors.length;
  return label => ({
    departing: {
      label: label + ' Departing',
      backgroundColor: colors[length % curColor],
      borderColor: colors[length % curColor++],
      data: [],
      fill: false
    },
    return: {
      label: label + ' Return',
      backgroundColor: colors[length % curColor],
      borderColor: colors[length % curColor++],
      data: [],
      fill: false
    }
  });
};

module.exports = dataset => {
  labels = dataset.map(data => data[5]);
  chartData = {};
  const generate = baseDatasetGenerator();
  dataset.forEach(d => {
    const label = [d[0], d[1], d[2], d[3], '(' + d[4] + ')'].join(' ');
    if (!(label in chartData)) {
      chartData[label] = generate(label);
    }
    chartData[label].departing.data.push(d[6]);
    chartData[label].return.data.push(d[7]);
  });

  const datasets = [];
  Object.values(chartData).forEach(data => {
    datasets.push(data.departing);
    datasets.push(data.return);
  });

  return {
    labels,
    datasets
  };
};

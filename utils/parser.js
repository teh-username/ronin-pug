const colors = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC'
];

const baseDatasetGenerator = (length, curColor = 1) => label => ({
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

module.exports = dataset => {
  labels = dataset.map(data => data[5]);
  chartData = {};
  const generate = baseDatasetGenerator(colors.length);
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

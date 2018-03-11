const colors = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#0082c8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#d2f53c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#aa6e28',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000080',
  '#808080',
  '#000000'
];

const baseDatasetGenerator = (length, curColor = 1) => label => ({
  departing: {
    label: label + ' Departing',
    backgroundColor: colors[curColor % length],
    borderColor: colors[curColor++ % length],
    data: [],
    fill: false
  },
  return: {
    label: label + ' Return',
    backgroundColor: colors[curColor % length],
    borderColor: colors[curColor++ % length],
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

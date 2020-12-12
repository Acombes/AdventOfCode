const fetch = require('node-fetch');

module.exports = cookie => fetch('https://adventofcode.com/2020/day/10/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n').map(Number).sort(((a, b) => a - b)),
    answers: [],
  }))
  .then(({data, answers}) => {
    const diffs = data.map((v, i, array) => i === 0 ? v : v - array[i-1]);
    return {
      data: diffs,
      answers: [
        ...answers,
        Object.values(
          diffs.reduce((counters, diff) => ({...counters, [diff]: (counters[diff] || 0) + 1}), {3: 1}),
        ).reduce(((product, v) => product * v)),
      ],
    }
  })
  .then(({data, answers}) => {
    return {
      data,
      answers: [
        ...answers,
        data.join('').split(/3+/).filter(l => l > 1).map(str => ({3:2,4:4,5:7}[str.length + 1])).reduce((p, v) => p * v),
      ],
    };
  });

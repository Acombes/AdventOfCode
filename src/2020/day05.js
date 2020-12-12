const fetch = require('node-fetch');

function convertToBinary(string, mapping) {
  return parseInt(Object.entries(mapping).reduce((result, [key, value]) => result.replace(new RegExp(key, 'g'), value), string), 2);
}

function getSeatIds(seats) {
  return seats.map(seat => {
    const [, row, column] = seat.match(/^([FB]{7})([LR]{3})$/i);
    return convertToBinary(row, {F: 0, B: 1}) * 8 + convertToBinary(column, {L: 0, R: 1});
  });
}

module.exports = cookie => fetch('https://adventofcode.com/2020/day/5/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n'),
    answers: [],
  }))
  .then(({data, answers}) => ({
    data,
    answers: [
      ...answers,
      getSeatIds(data).reduce((max, id) => Math.max(max, id)),
    ],
  }))
  .then(({data, answers}) => ({
    answers: [
      ...answers,
      getSeatIds(data).sort((a, b) => a > b).find((id, i, array) => i > 0 && id !== array[i - 1] + 1) - 1,
    ],
  }));

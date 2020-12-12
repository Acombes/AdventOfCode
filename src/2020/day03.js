const fetch = require('node-fetch');

function countChars(grid, {dx, dy}, char) {
  let chars = 0;
  for (let y = 0; y < grid.length; y += dy) {
    chars += grid[y][(y * dx / dy) % grid[y].length] === char;
  }
  return chars;
}

module.exports = cookie => fetch('https://adventofcode.com/2020/day/3/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n').map(line => line.split('')),
    answers: [],
  }))
  .then(({data, answers}) => ({
    data,
    answers: [
      ...answers,
      countChars(data, {dx: 3, dy: 1}, '#'),
    ],
  }))
  .then(({data, answers}) => ({
    answers: [
      ...answers,
      [
        {dx: 1, dy: 1},
        {dx: 3, dy: 1},
        {dx: 5, dy: 1},
        {dx: 7, dy: 1},
        {dx: 1, dy: 2},
      ].reduce((res, path) => res * countChars(data, path, '#'), 1),
    ],
  }));

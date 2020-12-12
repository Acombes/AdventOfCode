const fetch = require('node-fetch');

module.exports = cookie => fetch('https://adventofcode.com/2020/day/6/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n\n').map(group => group.split('\n').map(person => person.split(''))),
    answers: [],
  }))
  .then(({data, answers}) => ({
    data,
    answers: [
      ...answers,
      data
        .map(group => group.reduce((answers, person) => {
          person.forEach(answer => answers.add(answer));
          return answers;
        }, new Set()))
        .reduce((sum, group) => sum + group.size, 0),
    ],
  }))
  .then(({data, answers}) => ({
    data,
    answers: [
      ...answers,
      data
        .map(group => group[0].filter(v => group.every(a => a.includes(v))))
        .reduce((sum, group) => sum + group.length, 0),
    ],
  }));

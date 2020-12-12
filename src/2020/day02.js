const fetch = require('node-fetch');

module.exports = cookie => fetch('https://adventofcode.com/2020/day/2/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n').map(line => {
      const [, nb1, nb2, char, password] = line.match(/^(\d+)-(\d+) (\w): (.*)$/);
      return {nb1, nb2, char, password};
    }),
    answers: [],
  }))
  .then(({data, answers}) => ({
    data: data,
    answers: [
      ...answers,
      data.filter(({nb1, nb2, char, password}) => {
        const nb = password.split(char).length - 1;
        return nb <= nb2 && nb >= nb1;
      }).length
    ],
  }))
  .then(({data, answers}) => {
    return {
      data,
      answers: [
        ...answers,
        data.filter(({nb1, nb2, char, password}) => {
          const match1 = password.charAt(nb1 - 1) === char;
          const match2 = password.charAt(nb2 - 1) === char;
          return (match1 && !match2) || (!match1 && match2);
        }).length,
      ],
    };
  });

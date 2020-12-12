const fetch = require('node-fetch');

const TARGET_SUM = 2020;

module.exports = cookie => fetch('https://adventofcode.com/2020/day/1/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n').map(Number),
    answers: [],
  }))
  .then(({data, answers}) => {
    const number = data.find((number, i, array) => array.indexOf(TARGET_SUM - number) !== -1);
    return {
      data,
      answers: [
        ...answers,
        number * (TARGET_SUM - number),
      ],
    }
  })
  .then(({data, answers}) => {
    let result = null;
    data.some((number1, i, array1) =>
        array1.slice(i).some((number2, j, array2) =>
          array2.slice(j).some(number3 => {
            const bool = number1 + number2 + number3 === TARGET_SUM;
            if (bool) {
              result = number1 * number2 * number3;
            }
            return bool;
          })
        )
      , null);

    return {
      data,
      answers: [
        ...answers,
        result,
      ],
    };
  });

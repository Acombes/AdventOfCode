const fetch = require('node-fetch');

function validatePassports(passports, validation) {
  return passports.filter(passport => !Object.entries(validation).some(([field, fieldValidation]) => !fieldValidation(passport[field])))
}

module.exports = cookie => fetch('https://adventofcode.com/2020/day/4/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n\n').map(passport => Object.fromEntries(
      passport
        .replace(/\n/g, ' ')
        .split(' ')
        .map(field => field.split(':'))
    )),
    answers: [],
  }))
  .then(({data, answers}) => {
    return {
      data,
      answers: [
        ...answers,
        validatePassports(data, {
          'byr': v => v,
          'iyr': v => v,
          'eyr': v => v,
          'hgt': v => v,
          'hcl': v => v,
          'ecl': v => v,
          'pid': v => v,
        }).length,
      ],
    }
  })
  .then(({data, answers}) => {
    return {
      data,
      answers: [
        ...answers,
        validatePassports(data, {
          'byr': v => v && 1920 <= v && v <= 2002,
          'iyr': v => v && 2010 <= v && v <= 2020,
          'eyr': v => v && 2020 <= v && v <= 2030,
          'hgt': v => {
            if (!v) {
              return false
            }
            const UNITS = {
              in: {min: 59, max: 76},
              cm: {min: 150, max: 193},
            };
            const [, nb, unit] = v.match(new RegExp(`([0-9]+)(${Object.keys(UNITS).join('|')})`)) || [];
            if (!nb || Object.keys(UNITS).indexOf(unit) === -1) {
              return false
            }
            return UNITS[unit].min <= nb && nb <= UNITS[unit].max;
          },
          'hcl': v => v && v.match(/^#[0-9a-f]{6}$/),
          'ecl': v => v && ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(v) !== -1,
          'pid': v => v && v.match(/^[\d]{9}$/),
        }).length,
      ],
    };
  });

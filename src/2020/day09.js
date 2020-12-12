const fetch = require('node-fetch');

PREAMBLE_SIZE = 25;
module.exports = cookie => fetch('https://adventofcode.com/2020/day/9/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n').map(Number),
    answers: [],
  }))
  .then(({data, answers}) => ({
    data,
    answers: [
      ...answers,
      data.find((v, i, data) => i >= PREAMBLE_SIZE && data.slice(i - PREAMBLE_SIZE, i).every((n, _, a) => !a.includes(v - n)))
    ]
  }))
  .then(({data, answers}) => ({
    answers: [
      ...answers,
      {
        data: [],
        head: 2,
        set: [],
        sum: 0,
        target: undefined,
        safety() {
          return this.set.length >= 2 && this.head < this.data.length;
        },
        step() {
          if (this.sum === this.target) {
            return Math.min(...this.set) + Math.max(...this.set);
          }
          if (this.sum > this.target) {
            this.sum -= this.set.shift();
          } else {
            this.set.push(this.data[++this.head]);
            this.sum += this.set[this.set.length - 1];
          }
          if (this.safety()) {
            return this.step();
          }
        },
        run(data, target) {
          this.data = data;
          this.target = target;
          this.set = data.slice(0, this.head);
          this.sum = this.set.reduce((a, b) => a + b);

          return this.step();
        },
      }.run(data, answers[0]),
    ]
  }));

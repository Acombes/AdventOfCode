const fetch = require('node-fetch');

const ComplexNumber = require('./day12-ComplexNumber');

const COMMANDS = {
  NORTH: 'N',
  EAST: 'E',
  SOUTH: 'S',
  WEST: 'W',
  FORWARD: 'F',
  LEFT: 'L',
  RIGHT: 'R',
};
const DIRECTIONS = {
  N: new ComplexNumber(0, 1),
  E: new ComplexNumber(1, 0),
  S: new ComplexNumber(0, -1),
  W: new ComplexNumber(-1, 0),
}

const getSailer = (journey, orientation, onMove, onRotate, onForward) => ({
  progress: 0,
  position: new ComplexNumber(),
  orientation,
  getThisData() {
    return {
      position: this.position,
      orientation: this.orientation,
    }
  },
  commitNewData (data) {
    Object.keys(this.getThisData()).forEach(key => {
      if (key in data) {
        this[key] = data[key];
      }
    })
  },
  move(direction, amount) {
    this.commitNewData(onMove(this.getThisData(), direction, amount))
  },
  rotate(angle) {
    this.commitNewData(onRotate(this.getThisData(), angle))
  },
  forward(amount) {
    this.commitNewData(onForward(this.getThisData(), amount))
  },
  sail(log = false, progress = 0) {
    const [action, amountStr] = journey[progress];
    const amount = parseInt(amountStr, 10);
    switch(action) {
      case COMMANDS.LEFT:
        this.rotate(amount);
        break;
      case COMMANDS.RIGHT:
        this.rotate(-amount);
        break;
      case COMMANDS.FORWARD:
        this.forward(amount);
        break;
      default:
        this.move(DIRECTIONS[action], amount);
    }

    if (log) {
      console.log(journey[progress], this.position, this.orientation)
    }
    if (progress < journey.length - 1) {
      return this.sail(log, progress + 1);
    }
    return this;
  },
})

/*/
Promise.resolve(`
F10
N3
F7
R90
F11
`)
/*/
module.exports = cookie => fetch('https://adventofcode.com/2020/day/12/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  //*/
  .then(input => ({
    data: input.trim().split('\n').map(a => a.match(new RegExp(`([${Object.values(COMMANDS).join('')}])(\\d+)`)).slice(1, 3)),
    answers: [],
  }))
  .then(({data, answers}) => ({
    data,
    answers: [
      ...answers,
      getSailer(
        data,
        DIRECTIONS.E,
        (state, direction, amount) => ({position: state.position.plus(direction.times(amount))}),
        (state, angle) => ({orientation: state.orientation.times(ComplexNumber.I.pow(Math.trunc(angle / 90)))}),
        (state, amount) => ({position: state.position.plus(state.orientation.times(amount))})
      ).sail().position.taxiCab(),
    ]
  }))
  .then(({data, answers}) => ({
    answers: [
      ...answers,
      getSailer(
        data,
        new ComplexNumber(10, 1),
        (state, direction, amount) => ({orientation: state.orientation.plus(direction.times(amount))}),
        (state, angle) => ({orientation: state.orientation.times(ComplexNumber.I.pow(Math.trunc(angle / 90)))}),
        (state, amount) => ({position: state.position.plus(state.orientation.times(amount))})
      ).sail().position.taxiCab(),
    ]
  }));

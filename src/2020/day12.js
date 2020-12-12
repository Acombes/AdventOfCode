const fetch = require('node-fetch');

const COMMANDS = {
  NORTH: 'N',
  EAST: 'E',
  SOUTH: 'S',
  WEST: 'W',
  FORWARD: 'F',
  LEFT: 'L',
  RIGHT: 'R',
};

const getSailer = (journey, orientation, onMove, onRotate, onForward) => ({
  progress: 0,
  position: {x: 0, y: 0},
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
        this.rotate(-amount);
        break;
      case COMMANDS.RIGHT:
        this.rotate(amount);
        break;
      case COMMANDS.FORWARD:
        this.forward(amount);
        break;
      default:
        this.move(action, amount);
    }

    if (log) {
      console.log(this.position, this.orientation)
    }
    if (progress < journey.length - 1) {
      return this.sail(log, progress + 1);
    }
    return this;
  },
  getManhattanDistance () {
    return Math.abs(this.position.x) + Math.abs(this.position.y);
  }
})

module.exports = cookie => fetch('https://adventofcode.com/2020/day/12/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n').map(movement => movement.match(/([NWESFRL])(\d+)/).slice(1, 3)),
    answers: [],
  }))
  .then(({data, answers}) => {
    function move(state, direction, amount) {
      switch (direction) {
        case COMMANDS.NORTH:
          return {position: {...state.position, y: state.position.y + amount}};
        case COMMANDS.EAST:
          return {position: {...state.position, x: state.position.x + amount}};
        case COMMANDS.SOUTH:
          return {position: {...state.position, y: state.position.y - amount}};
        case COMMANDS.WEST:
          return {position: {...state.position, x: state.position.x - amount}};
        default:
      }
    }
    return {
      data,
      answers: [
        ...answers,
        getSailer(
          data,
          COMMANDS.EAST,
          move,
          (state, angle) => {
            const orientations = [COMMANDS.NORTH, COMMANDS.EAST, COMMANDS.SOUTH, COMMANDS.WEST];
            const nextIndex = orientations.indexOf(state.orientation) + Math.floor(angle / 90);
            const reducedIndex = ((Math.abs(Math.trunc(nextIndex / orientations.length)) + 1) * orientations.length + nextIndex) % orientations.length
            return {orientation: orientations[reducedIndex]};
          },
          (state, amount) => move(state, state.orientation, amount)
        ).sail().getManhattanDistance(),
      ]
    }
  })
  .then(({ data, answers }) => ({
    answers: [
      ...answers,
      getSailer(
        data,
        {x: 10, y: 1},
        (state, direction, amount) => {
          switch (direction) {
            case COMMANDS.NORTH:
              return {orientation: {...state.orientation, y: state.orientation.y + amount}};
            case COMMANDS.EAST:
              return {orientation: {...state.orientation, x: state.orientation.x + amount}};
            case COMMANDS.SOUTH:
              return {orientation: {...state.orientation, y: state.orientation.y - amount}};
            case COMMANDS.WEST:
              return {orientation: {...state.orientation, x: state.orientation.x - amount}};
            default:
          }
        },
        (state, angle) => {
          const quarterTurns = angle / 90
          const angleSign = Math.abs(angle) / angle;
          switch(Math.abs(quarterTurns)) {
            case 1:
              return { orientation: { x: state.orientation.y * angleSign, y: -state.orientation.x * angleSign } };
            case 2:
              return { orientation: { x: -state.orientation.x, y: -state.orientation.y } };
            case 3:
              return { orientation: { x: -state.orientation.y * angleSign, y: state.orientation.x * angleSign } };
            default:
              return { orientation: state.orientation }
          }
        },
        (state, amount) => {
          return {
            position: {
              x: state.position.x + state.orientation.x * amount,
              y: state.position.y + state.orientation.y * amount
            }
          };
        }
      ).sail().getManhattanDistance(),
    ]
  }));

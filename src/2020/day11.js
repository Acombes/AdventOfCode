const fetch = require('node-fetch');

const GROUND = '.';
const SEAT_EMPTY = 'L';
const SEAT_TAKEN = '#';

const getRunner = (startLayout, tolerance, getNbAdjacentCellsOfType) => ({
  layout: startLayout,
  stabilized: false,
  calculate() {
    let hasChanged = false;

    this.layout = this.layout.map((row, rowIndex) => row.split('').map((cell, colIndex) => {
      const takenAdjacentSeats = getNbAdjacentCellsOfType(this.layout, rowIndex, colIndex, SEAT_TAKEN);
      if (cell === GROUND) {
        return cell;
      }
      if (cell === SEAT_EMPTY && takenAdjacentSeats === 0) {
        hasChanged = true;
        return SEAT_TAKEN;
      }
      if (cell === SEAT_TAKEN && takenAdjacentSeats >= tolerance) {
        hasChanged = true;
        return SEAT_EMPTY;
      }
      return cell;
    }).join(''));
    if (hasChanged) {
      return this.calculate();
    }
    return this;
  },
  getSeatsOfType(seatType) {
    return this.layout.reduce((acc, row) => acc + row.split(seatType).length - 1, 0)
  },
});

module.exports = cookie => fetch('https://adventofcode.com/2020/day/11/input', {
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
      getRunner(data, 4, (layout, row, col, seatType) => {
          const seats = [layout[row].charAt(col - 1), layout[row].charAt(col + 1)];
          if (row > 0) {
            seats.push(layout[row - 1].slice(Math.max(0, col - 1), col + 2));
          }
          if (row < layout.length - 1) {
            seats.push(layout[row + 1].slice(Math.max(0, col - 1), col + 2));
          }
          return seats.flat().join('').split(seatType).length - 1;
        },
      ).calculate().getSeatsOfType(SEAT_TAKEN)
    ]
  }))
  .then(({data, answers}) => ({
    data,
    answers: [
      ...answers,
      getRunner(data, 5, (layout, cellRow, cellCol, seatType) => {
          const horizontal = layout[cellRow].split('');
          const vertical = layout.map(row => row[cellCol]);
          const posDiag = layout.map((row, rowIndex) => row.charAt(rowIndex + cellCol - cellRow));
          const negDiag = layout.map((row, rowIndex) => row.charAt(cellCol + cellRow - rowIndex));
          const directions = [
            // Left
            horizontal.slice(0, cellCol).reverse(),
            // Right
            horizontal.slice(cellCol + 1),
            // Top
            vertical.slice(0, cellRow).reverse(),
            // Bottom
            vertical.slice(cellRow + 1),
            // TopLeft
            posDiag.slice(0, cellRow).reverse(),
            // BottomRight
            posDiag.slice(cellRow + 1),
            // TopRight
            negDiag.slice(0, cellRow).reverse(),
            // BottomLeft
            negDiag.slice(cellRow + 1),
          ];
          return directions.filter(direction => direction.find(cell => cell !== GROUND) === seatType).length;
        },
      ).calculate().getSeatsOfType(SEAT_TAKEN)
    ]
  }));

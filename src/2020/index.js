const { formatTime } = require('../utils');

module.exports = session => {
  const promises = {
    'Day 01': {resolved: false, promise: require('./day01')(session), timer: Date.now()},
    'Day 02': {resolved: false, promise: require('./day02')(session), timer: Date.now()},
    'Day 03': {resolved: false, promise: require('./day03')(session), timer: Date.now()},
    'Day 04': {resolved: false, promise: require('./day04')(session), timer: Date.now()},
    'Day 05': {resolved: false, promise: require('./day05')(session), timer: Date.now()},
    'Day 06': {resolved: false, promise: require('./day06')(session), timer: Date.now()},
    'Day 07': {resolved: false, promise: require('./day07')(session), timer: Date.now()},
    'Day 08': {resolved: false, promise: require('./day08')(session), timer: Date.now()},
    'Day 09': {resolved: false, promise: require('./day09')(session), timer: Date.now()},
    'Day 10': {resolved: false, promise: require('./day10')(session), timer: Date.now()},
    'Day 11': {resolved: false, promise: require('./day11')(session), timer: Date.now()},
    'Day 12 with complex': {resolved: false, promise: require('./day12-withComplex')(session), timer: Date.now()},
  };

  function updateConsole() {
    console.clear();
    Object.entries(promises).forEach(([label, {resolved}]) => {
      if (resolved) {
        console.log('\x1b[32m%s\x1b[0m', `✔ - ${label} `);
      } else {
        console.log('\x1b[31m%s\x1b[0m', `✘ - ${label} `);
      }
    });
  }

  updateConsole();

  Object.entries(promises).forEach(([label, {promise}]) => {
    promise.then(() => {
      promises[label].resolved = true;
      promises[label].timer = Date.now() - promises[label].timer;
      updateConsole();
    })
  });

  Promise.all(Object.values(promises).map(({promise}) => promise)).then(days => {
    console.clear();
    const promisesEntries = Object.entries(promises);
    days.forEach(({answers}, dayIndex) => {
      const label = promisesEntries.map(([key]) => key)[dayIndex];
      const timer = formatTime(promisesEntries.map(([, {timer}]) => timer)[dayIndex])
      console.group(`${label} - ${timer}`);
      answers.forEach((answer, i) => console.log(`Part ${i + 1}:`, answer));
      console.groupEnd();
    })
  })
};

const fetch = require('node-fetch');

function run(program, start = 0) {
  let value = start;
  let state = 0;
  const executedInstructions = [];
  while (state < program.length && !executedInstructions.includes(state)) {
    const [cmd, arg] = program[state];
    executedInstructions.push(state);
    switch (cmd) {
      case 'jmp':
        state += arg;
        break;
      case 'acc':
        value += arg;
      default:
        state++;
    }
  }
  return {value, didTerminate: state === program.length};
}

module.exports = cookie => fetch('https://adventofcode.com/2020/day/8/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: input.trim().split('\n').map(instruction => {
      const [, cmd, arg] = instruction.match(/^(\w+) ([-+]\d+)$/);
      return [cmd, parseInt(arg, 10)];
    }),
    answers: [],
  }))
  .then(({data, answers}) => ({
    data,
    answers: [
      ...answers,
      run(data).value,
    ],
  }))
  .then(({data, answers}) => {
    function fixAndRun(program) {
      for (let [i, cmd, arg] of program.reduce((acc, [cmd, arg], i) => cmd === 'nop' || cmd === 'jmp' ? [...acc, [i, cmd, arg]] : acc, [])) {
        const {value, didTerminate} = run([
          ...program.slice(0, i),
          [cmd === 'nop' ? 'jmp' : 'nop', arg],
          ...program.slice(i + 1)
        ]);
        if (didTerminate) {
          return value;
        }
      }
      return 'No valid fix found';
    }

    return {
      data,
      answers: [
        ...answers,
        fixAndRun(data),
      ],
    }
  });

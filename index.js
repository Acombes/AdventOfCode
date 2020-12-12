const fs = require('fs');
const { session } = require('./package.json');

const YEARS_DIRECTORY = './src';

const [ year, day ] = process.argv.slice(2).map(Number);

if (year && day) {
  try {
    require(`${YEARS_DIRECTORY}/${year}/day${day.toString().padStart(2, '0')}`)(session).then(({ answers }) => {
      console.group(`Day ${day}`);
      answers.forEach((answer, i) => console.log(`Part ${i + 1}:`, answer));
      console.groupEnd();
    })
  } catch(e) {
    console.error('\x1b[31m%s\x1b[0m', `Could not find anything for day ${day} in year ${year}`);
  }
} else if (year && !day) {
  try {
    require(`${YEARS_DIRECTORY}/${year}`)(session);
  } catch(e) {
    // console.error('\x1b[31m%s\x1b[0m', `Could not find anything for year ${year}`);
    console.error('\x1b[31m%s\x1b[0m', e);
  }
} else {
  require(`${YEARS_DIRECTORY}/${fs.readdirSync(YEARS_DIRECTORY, {withFileTypes: true})
    .filter(file => file.isDirectory() && file.name.charAt(0) !== '.' && !isNaN(parseInt(file.name)))
    .map(({name}) => name)
    .reduce((mostRecent, name) => Math.max(mostRecent, parseInt(name)))
  }/`)(session);
}

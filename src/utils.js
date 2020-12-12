function getNDecimals(number, decimals, isRound) {
  const trunc = isRound ? Math.round : Math.trunc;
  return trunc(number * 10 ** decimals) / 10 ** decimals;
}

const TIME_UNITS = ['ms', 's', 'min', 'h', 'j', 'y']; // Let's not go too far
const SECOND = 1e3;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const YEAR = DAY * 365.25;
function formatTime (time) {
  const units = []
  let remainingTime = time;

  if (remainingTime >= YEAR) {
    units[5] = getNDecimals(remainingTime / YEAR, 0);
    remainingTime = remainingTime % YEAR;
  }
  if (remainingTime >= DAY) {
    units[4] = getNDecimals(remainingTime / DAY, 0);
    remainingTime = remainingTime % DAY;
  }
  if (remainingTime >= HOUR) {
    units[3] = getNDecimals(remainingTime / HOUR, 0);
    remainingTime = remainingTime % HOUR;
  }
  if (remainingTime >= MINUTE) {
    units[2] = getNDecimals(remainingTime / MINUTE, 0);
    remainingTime = remainingTime % MINUTE;
  }
  if (remainingTime >= SECOND) {
    units[1] = getNDecimals(remainingTime / SECOND, 1);
  }
  // Only show milliseconds if it matters
  if (units.length) {
    units[0] = undefined;
  } else {
    units[0] = time;
  }
  return units
    .map((value, i) => value && (value + TIME_UNITS[i]))
    .filter(x => x)
    .reverse()
    .join(' ');
}

module.exports = {
  formatTime,
};

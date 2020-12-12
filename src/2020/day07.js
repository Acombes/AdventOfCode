const fetch = require('node-fetch');

module.exports = cookie => fetch('https://adventofcode.com/2020/day/7/input', {
  headers: {
    cookie: `session=${cookie}`,
  },
})
  .then(response => response.text())
  .then(input => ({
    data: Object.fromEntries(input.trim().split('\n').map(rule => {
      const [container, content] = rule.split(' bags contain ');
      if(content === 'no other bags.') {
        return [container, {}];
      }
      return [
        container,
        Object.fromEntries(content
          .split(', ')
          .map(contentType => {
            const [, number, type] = contentType.match(/(\d+) ([\w\s]+) bag/);
            return [type, parseInt(number, 10)];
          })
        )]
    })),
    answers: [],
  }))
  .then(({data, answers}) => {
    function findBagsParents(rules, bags, parents = new Set()) {
      if (!bags.size) { return parents }
      const bagsParents = new Set(
        Object.entries(rules)
          .filter(([, content]) => [...bags].some(color => color in content))
          .map(([bag]) => bag)
      );
      return findBagsParents(
        rules,
        // Set difference so we only look up parents we haven't looked up before
        new Set([...bagsParents].filter(x => !parents.has(x))),
        // Merge parents Sets
        new Set([...bagsParents, ...parents])
      );
    }

    return {
      data,
      answers: [
        ...answers,
        findBagsParents(data, new Set(['shiny gold'])).size,
      ],
    }
  })
  .then(({data, answers}) => {
    const findNumberOfBagsForColor = (function() {
      const resultsCache = {};
      return (rules, bagColor) => {
        if(!(bagColor in resultsCache)) {
          resultsCache[bagColor] = Object.entries(rules[bagColor]).reduce((sum, [containedBag, amount]) => sum + amount * (1 + findNumberOfBagsForColor(rules, containedBag)), 0);
        }
        return resultsCache[bagColor];
      }
    })()

    return {
      data,
      answers: [
        ...answers,
        findNumberOfBagsForColor(data, 'shiny gold'),
      ],
    }
  });

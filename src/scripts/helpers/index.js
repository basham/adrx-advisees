'use strict';

function round(value, exp) {
  return parseFloat(value).toFixed(exp);
}

module.exports = {
  round: round
};

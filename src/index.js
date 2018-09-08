require('dotenv/config');
const { makeFlowClient } = require('@dgac/nmb2b.client');
const { fromEnv } = require('@dgac/nmb2b.client/dist/security');
const moment = require('moment');
const Table = require('cli-table');
const security = fromEnv();
const fp = require('lodash/fp');

const {
  countByReason,
  countByRefLocType,
  countByCountry,
} = require('./regulation-manipulations');

init();

async function init() {
  const start = process.hrtime();
  const Flow = await makeFlowClient({
    security,
    flavour: process.env.B2B_FLAVOUR,
  });
  const [elapsedS, elapsedNs] = process.hrtime(start);

  console.log(
    `Initialized SOAP client in ${(elapsedS + elapsedNs / 1e9).toFixed(3)}s`,
  );

  const startTime = moment
    .utc()
    .subtract(10, 'hour')
    .startOf('hour')
    .toDate();

  const endTime = moment
    .utc()
    .add(10, 'hour')
    .startOf('hour')
    .toDate();

  const res = await Flow.queryRegulations({
    dataset: { type: 'OPERATIONAL' },
    queryPeriod: {
      wef: startTime,
      unt: endTime,
    },
    requestedRegulationFields: {
      item: ['location', 'reason'],
    },
  });

  const regulations = res.data.regulations.item;

  const byRefLocType = fp.compose(
    fp.reduce((prev, curr) => {
      prev.push(curr);
      return prev;
    }, new Table({ head: ['RefLoc Type', 'Count'] })),
    fp.orderBy('1', 'desc'),
    fp.toPairs,
    countByRefLocType,
  )(regulations);

  const byCountryCode = fp.compose(
    fp.reduce((prev, curr) => {
      prev.push(curr);
      return prev;
    }, new Table({ head: ['Country Code', 'Count'] })),
    fp.orderBy('1', 'desc'),
    fp.toPairs,
    countByCountry,
  )(regulations);

  const byReason = fp.compose(
    fp.reduce((prev, curr) => {
      prev.push(curr);
      return prev;
    }, new Table({ head: ['Reason', 'Count'] })),
    fp.orderBy('1', 'desc'),
    fp.toPairs,
    countByReason,
  )(regulations);

  console.log(byReason.toString());
  console.log(byRefLocType.toString());
  console.log(byCountryCode.toString());
}

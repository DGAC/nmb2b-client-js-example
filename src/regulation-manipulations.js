const countByReason = regulations =>
  regulations.reduce((prev, { reason }) => {
    prev[reason] = (prev[reason] || 0) + 1;
    return prev;
  }, {});

const locationToRefLocKey = location =>
  Object.keys(location).filter(k => k.match(/referenceLocation/))[0];

const countByRefLocType = regulations =>
  regulations.reduce((prev, { location }) => {
    const refLocKey = locationToRefLocKey(location);
    const referenceLocationType = refLocKey.replace(
      'referenceLocation-ReferenceLocation',
      '',
    );

    prev[referenceLocationType] = (prev[referenceLocationType] || 0) + 1;

    return prev;
  }, {});

const countByCountry = regulations =>
  regulations.reduce((prev, { location }) => {
    const refLocKey = locationToRefLocKey(location);
    const refLoc = location[refLocKey];
    const prefix = (refLoc.id || '').slice(0, 2);
    if (!prefix) {
      return prev;
    }

    prev[prefix] = (prev[prefix] || 0) + 1;
    return prev;
  }, {});

module.exports = {
  countByReason,
  countByRefLocType,
  countByCountry,
};

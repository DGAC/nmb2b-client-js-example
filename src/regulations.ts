import 'dotenv/config';
import { makeFlowClient } from '@dgac/nmb2b-client';
import { extractReferenceLocation } from '@dgac/nmb2b-client/utils';
import { fromEnv } from '@dgac/nmb2b-client/security';
import { sub, add } from 'date-fns';
import CliTable3 from 'cli-table3';

const security = fromEnv();

async function main() {
  const start = process.hrtime.bigint();

  const flavour = process.env.B2B_FLAVOUR ?? 'PREOPS';

  if (flavour !== 'PREOPS' && flavour !== 'OPS') {
    throw new Error(
      `${flavour} is not a valid B2B flavour. Use OPS or PREOPS.`,
    );
  }

  const Flow = await makeFlowClient({
    security,
    flavour,
    XSD_PATH: process.env.B2B_XSD_PATH ?? '/tmp/b2b-xsd',
  });

  const duration = Number(process.hrtime.bigint() - start);

  console.log(`Initialized SOAP client in ${(duration / 1e9).toFixed(3)}s`);

  const startTime = new Date() ?? sub(new Date(), { hours: 10 });
  const endTime = add(new Date(), { minutes: 1 });

  const res = await Flow.queryRegulations({
    dataset: { type: 'OPERATIONAL' },
    queryPeriod: {
      wef: startTime,
      unt: endTime,
    },
    requestedRegulationFields: {
      item: ['location', 'protectedLocation', 'applicability'],
    },
  });

  const regulations = res.data.regulations.item;

  const table = new CliTable3({
    head: ['Start', 'End', 'Regulation ID', 'Location', 'Protected Location'],
  });

  for (const regulation of regulations) {
    const location = extractReferenceLocation(
      'referenceLocation',
      regulation.location,
    );

    const protectedLocation = extractReferenceLocation(
      'protectedLocation',
      regulation,
    );

    table.push([
      regulation.applicability?.wef.toISOString(),
      regulation.applicability?.unt.toISOString(),
      regulation.regulationId,
      location ? `${location.id} (${location.type})` : '',
      protectedLocation
        ? `${protectedLocation.id} (${protectedLocation.type})`
        : '',
    ]);
  }

  console.log(table.toString());

  console.log(`Found ${regulations.length} regulations`);
}

main();

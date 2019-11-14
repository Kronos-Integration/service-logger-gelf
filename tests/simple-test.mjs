import test from 'ava';
import { StandaloneServiceProvider } from 'kronos-service';
import GelfLoggerService from '../src/gelf-logger-service';


const sp = new StandaloneServiceProvider();

test('gelf logger service state response', async t => {
  sp.registerServiceFactory(GelfLoggerService);

  const logger = sp.services.logger;
  await logger.start();

  t.is(logger.state, 'running');
});

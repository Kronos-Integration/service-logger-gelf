import { Service, ServiceProviderMixin } from 'kronos-service';
import {
  GelfLoggerService,
  registerWithManager
} from '../src/gelf-logger-service';

import test from 'ava';

class ServiceProvider extends ServiceProviderMixin(Service) {}

const sp = new ServiceProvider();

test('gelf logger service state response', async t => {
  await registerWithManager(sp);

  const logger = sp.services.logger;
  await logger.start();

  t.is(logger.state, 'running');
});

/* global describe, it*/
/* jslint node: true, esnext: true */
'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  endpoint = require('kronos-endpoint'),
  service = require('kronos-service'),
  ServiceConfig = service.ServiceConfig,
  GelfLogger = require('../service.js');

class ServiceProvider extends service.ServiceProviderMixin(service.Service) {}

const sp = new ServiceProvider();

describe('gelf logger service', () => {
  it('got state response', () =>
    GelfLogger.registerWithManager(sp).then(() => {
      const logger = sp.services.logger;
      return logger.start().then(() => assert.equal(logger.state, 'running'));
    }));
});

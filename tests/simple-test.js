/* global describe, it*/
/* jslint node: true, esnext: true */
'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  {
    Service, ServiceProviderMixin
  } = require('kronos-service'),
  {
    GelfLoggerService, registerWithManager
  } = require('../dist/module.js');

class ServiceProvider extends ServiceProviderMixin(Service) {}

const sp = new ServiceProvider();

describe('gelf logger service', () => {
  it('got state response', () =>
    registerWithManager(sp).then(() => {
      const logger = sp.services.logger;
      return logger.start().then(() => assert.equal(logger.state, 'running'));
    }));
});

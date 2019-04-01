'use strict';

var should = require('should');
var path = require('path');
var _ = require('lodash');
var async = require('async');

var SwaggerRunner = require('../..');

var TEST_PROJECT_ROOT = path.resolve(__dirname, '..', 'assets', 'project');
var TEST_PROJECT_CONFIG = {
  appRoot: TEST_PROJECT_ROOT
};
var MOCK_CONFIG = {
  appRoot: TEST_PROJECT_ROOT,
  bagpipes: {
    _router: {
      mockMode: true
    }
  }
};

describe('hapi_middleware', function () {

  describe('standard', function () {
    before(function (done) {
      createServer.call(this, TEST_PROJECT_CONFIG, done);
    });

    after(function (done) {
      this.app.stop(done);
    });

    require('../lib/common')();
  });

  describe('mock', function () {

    before(function (done) {
      createServer.call(this, MOCK_CONFIG, done);
    });

    after(function (done) {
      this.app.stop(done);
    });

    require('../lib/common_mock')();
  });
});

function createServer(config, done) {
  var hapi = require('hapi');
  this.app = new hapi.Server({
    host: 'localhost',
    port: 7236
  });
  var self = this;
  SwaggerRunner.create(config, function (err, r) {
    if (err) {
      console.error(err);
      return done(err);
    }
    self.runner = r;
    var middleware = self.runner.hapiMiddleware();

    const start = async function () {
      try {
        await self.app.register(middleware.plugin);
        await self.app.start();
      } catch (err) {
        console.log(err);
        process.exit(1);
      }
      done();
    };
    start();
  });
}

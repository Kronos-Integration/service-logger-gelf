/* jslint node: true, esnext: true */

'use strict';

const endpoint = require('kronos-endpoint'),
	service = require('kronos-service'),
	Gelf = require('gelf');

/**
 * Log receiving service
 */
class GelfLogger extends service.Logger {

	static get name() {
		return 'logger';
	}

	get type() {
		return GelfLogger.name;
	}

	get configurationAttributes() {
		return Object.assign({
			port: {
				description: 'gelf server port',
				type: 'integer',
				default: 12201,
				needsRestart: true
			},
			hostname: {
				description: 'gelf server name',
				type: 'string',
				default: '127.0.0.1',
				needsRestart: true
			}
		}, super.configurationAttributes);
	}

	_start() {
		const gelf = new Gelf({
			graylogPort: this.port,
			graylogHostname: this.hostname
		});

		this.endpoint.log.receive = entry => {
			try {
				gelf.emit('gelf.log', entry);
			} catch (e) {
				console.log(`Unable to log entry with the following keys: ${Object.keys(entry)} ${e}`);
				return Promise.reject(e);
			}
			return Promise.resolve();
		};

		return Promise.resolve();
	}
}

module.exports.registerWithManager = manager =>
	manager.registerServiceFactory(GelfLogger).then(sf =>
		manager.declareService({
			type: GelfLogger.name,
			name: GelfLogger.name
		}));

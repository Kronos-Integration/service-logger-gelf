/* jslint node: true, esnext: true */

'use strict';

import {
	Service,
	ServiceLogger
}
from 'kronos-service';
import {
	createAttributes, mergeAttributes
}
from 'model-attributes';

const Gelf = require('gelf');

/**
 * Log receiving service
 */
class GelfLoggerService extends ServiceLogger {

	static get name() {
		return 'gelf-logger';
	}

	static get configurationAttributes() {
		return mergeAttributes(createAttributes({
			graylogPort: {
				description: 'gelf server port',
				type: 'ip-port',
				default: 12201,
				needsRestart: true
			},
			graylogHostname: {
				description: 'gelf server name',
				type: 'hostname',
				default: '127.0.0.1',
				needsRestart: true
			},
			connection: {
				type: 'string',
				default: 'wan',
				needsRestart: true
			},
			maxChunkSizeWan: {
				type: 'unsigned-integer',
				default: 1420,
				needsRestart: true
			},
			maxChunkSizeLan: {
				type: 'unsigned-integer',
				default: 8154,
				needsRestart: true
			}
		}), Service.configurationAttributes);
	}

	_start() {
		const gelf = new Gelf({
			graylogPort: this.graylogPort,
			graylogHostname: this.graylogHostname,
			connection: this.connection,
			maxChunkSizeWan: this.maxChunkSizeWan,
			maxChunkSizeLan: this.maxChunkSizeLan
		});

		this.endpoints.log.receive = entry => {
			try {
				gelf.emit('gelf.log', entry);
			} catch (e) {
				console.error(`Unable to log entry with the following keys: ${Object.keys(entry)} ${e}`);
				return Promise.reject(e);
			}
			return Promise.resolve();
		};

		return Promise.resolve();
	}
}

function registerWithManager(manager) {
	return manager.registerServiceFactory(GelfLoggerService).then(sf => {
		return manager.declareService({
			type: GelfLoggerService.name,
			name: 'logger'
		});
	});
}

export {
	GelfLoggerService,
	registerWithManager
};

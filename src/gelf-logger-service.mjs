import { Service, ServiceLogger } from "@kronos-integration/service";
import { prepareAttributesDefinitions, default_attribute } from "pacc";
import Gelf from "gelf";

/**
 * Log receiving service
 */
export class GelfLoggerService extends ServiceLogger {
  /**
   * @return {string} 'gelf-logger'
   */
  static get name() {
    return "gelf-logger";
  }

  static attributes = prepareAttributesDefinitions(
    {
      graylogPort: {
        description: "gelf server port",
        type: "ip-port",
        default: 12201,
        needsRestart: true
      },
      graylogHostname: {
        ...default_attribute,
        description: "gelf server name",
        type: "hostname",
        default: "127.0.0.1",
        needsRestart: true
      },
      connection: {
        ...default_attribute,
        default: "wan",
        needsRestart: true
      },
      maxChunkSizeWan: {
        type: "unsigned-integer",
        default: 1420,
        needsRestart: true
      },
      maxChunkSizeLan: {
        type: "unsigned-integer",
        default: 8154,
        needsRestart: true
      }
    },
    Service.attributes
  );

  async _start() {
    const gelf = new Gelf({
      graylogPort: this.graylogPort,
      graylogHostname: this.graylogHostname,
      connection: this.connection,
      maxChunkSizeWan: this.maxChunkSizeWan,
      maxChunkSizeLan: this.maxChunkSizeLan
    });

    this.endpoints.log.receive = async entry => {
      try {
        gelf.emit("gelf.log", entry);
      } catch (e) {
        console.error(
          `Unable to log entry with the following keys: ${Object.keys(
            entry
          )} ${e}`
        );
        throw e;
      }
    };
  }
}

export default GelfLoggerService;

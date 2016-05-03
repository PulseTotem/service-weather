/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 *
 *     (Forecast.io : https://developer.forecast.io/docs/v2 )
 */
/// <reference path="../t6s-core/core-backend/scripts/server/SourceServer.ts" />
/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./WeatherNamespaceManager.ts" />

class WeatherService extends SourceServer {

	/**
	 * Constructor.
	 *
	 * @param {number} listeningPort - Server's listening port..
	 * @param {Array<string>} arguments - Server's command line arguments.
	 */
	constructor(listeningPort : number, arguments : Array<string>) {
		super(listeningPort, arguments);

		this.init();
	}

	/**
	 * Method to init the WeatherService server.
	 *
	 * @method init
	 */
	init() {
		var self = this;

		this.addNamespace("Weather", WeatherNamespaceManager);
	}
}

/**
 * Server's Weather listening port.
 *
 * @property _WeatherListeningPort
 * @type number
 * @private
 */
var _WeatherListeningPort : number = process.env.PORT || 6021;

/**
 * Server's Weather command line arguments.
 *
 * @property _WeatherArguments
 * @type Array<string>
 * @private
 */
var _WeatherArguments : Array<string> = process.argv;

var serverInstance = new WeatherService(_WeatherListeningPort, _WeatherArguments);
serverInstance.run();
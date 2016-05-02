/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 *
 *     (Forecast.io : https://developer.forecast.io/docs/v2 )
 */
/// <reference path="../t6s-core/core-backend/scripts/server/SourceServer.ts" />
/// <reference path="../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="./WeatherNamespaceManager.ts" />


	//TODO : pour test
	/// <reference path="./sources/GetForecast.ts" />

class Weather extends SourceServer {

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
	 * Method to init the Weather server.
	 *
	 * @method init
	 */
	init() {
		var self = this;

		this.addNamespace("Weather", WeatherNamespaceManager);

		//TODO : pour test
		var params : any = {};
		params.Limit = 1;
		params.InfoDuration = 10;
		params.Latitude = "43.6270849";
		params.Longitude = "7.0391623";

		var fc : GetForecast = new GetForecast(params, null);
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

var serverInstance = new Weather(_WeatherListeningPort, _WeatherArguments);
serverInstance.run();
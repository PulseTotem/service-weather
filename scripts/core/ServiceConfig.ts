/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 *
 *     (Forecast.io : https://developer.forecast.io/docs/v2 )
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

var fs = require('fs');

/**
 * Contains Service Configuration information.
 *
 * @class ServiceConfig
 */
class ServiceConfig {

	/**
	 * Weather Host.
	 *
	 * @property weatherHost
	 * @type string
	 * @static
	 */
	static weatherHost : string = "";

	/**
	 * Weather API Key.
	 *
	 * @property weatherApiKey
	 * @type string
	 * @static
	 */
	static weatherApiKey : string = "";

	/**
	 * Forecast Endpoint.
	 *
	 * @property forecastEndpoint
	 * @type string
	 * @static
	 */
	static forecastEndpoint : string = "forecast/";

	/**
	 * Retrieve configuration information from file description.
	 *
	 * @method retrieveConfigurationInformation
	 * @static
	 */
	static retrieveConfigurationInformation() {
		if(ServiceConfig.weatherHost == "" && ServiceConfig.weatherApiKey == "") {
			var file = __dirname + '/service_config.json';
			try {
				var configInfos = JSON.parse(fs.readFileSync(file, 'utf8'));
				ServiceConfig.weatherHost = configInfos.weatherHost;
				ServiceConfig.weatherApiKey = configInfos.weatherApiKey;
			} catch (e) {
				Logger.error("Service configuration file can't be read.");
				Logger.debug(e);
			}
		}
	}

	/**
	 * Return Weather Host.
	 *
	 * @method getWeatherHost
	 * @static
	 * @return {string} - CMS Host.
	 */
	static getWeatherHost() : string {
		ServiceConfig.retrieveConfigurationInformation();
		return ServiceConfig.weatherHost;
	}

	/**
	 * Return Weather API Key.
	 *
	 * @method getWeatherApiKey
	 * @static
	 * @return {string} - CMS Auth Key.
	 */
	static getWeatherApiKey() : string {
		ServiceConfig.retrieveConfigurationInformation();
		return ServiceConfig.weatherApiKey;
	}
}
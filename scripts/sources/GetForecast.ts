/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 *
 *     (Forecast.io : https://developer.forecast.io/docs/v2 )
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/server/SourceItf.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClient.ts" />
/// <reference path="../../t6s-core/core-backend/scripts/RestClientResponse.ts" />

/// <reference path="../core/ServiceConfig.ts" />

/// <reference path="../core/WeatherHelper.ts" />

/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/Forecast.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/Weather.ts" />

var uuid : any = require('node-uuid');
var moment : any = require('moment');

/**
 * Represents the GetForecast Weather's Source.
 *
 * @class GetForecast
 * @extends SourceItf
 */
class GetForecast extends SourceItf {

	/**
	 * Constructor.
	 *
	 * @param {Object} params - Source's params.
	 * @param {WeatherNamespaceManager} weatherNamespaceManager - NamespaceManager attached to Source.
	 */
	constructor(params : any, weatherNamespaceManager : WeatherNamespaceManager) {
		super(params, weatherNamespaceManager);

		if (this.checkParams(["Limit", "InfoDuration", "Latitude", "Longitude"])) {
			this.run();
		}
	}

	run() {
		var self = this;

		var fail = function(error) {
			if(error) {
				Logger.error(error);
			}
		};

		var successRetrieveForecast = function(result) {
			var forecastJSON = result.data();

			var forecast : Forecast = new Forecast();

			var latitude = forecastJSON.latitude;
			var longitude = forecastJSON.longitude;

			forecast.setId(latitude + "-" + longitude);

			var creationDate : any = moment();
			forecast.setCreationDate(creationDate.toDate());

			if(typeof(forecastJSON.currently) != "undefined") {
				var currentWeather : Weather = WeatherHelper.buildWeather(forecastJSON.currently);
				currentWeather.setDurationToDisplay(parseInt(self.getParams().InfoDuration));
				currentWeather.setLatitude(latitude);
				currentWeather.setLongitude(longitude);

				forecast.setCurrent(currentWeather);

				if(currentWeather.getTime() != null) {
					var newCreationDate:any = moment.unix(currentWeather.getTime());
					forecast.setCreationDate(newCreationDate.toDate());
				}
			}

			if(typeof(forecastJSON.hourly) != "undefined") {
				forecastJSON.hourly.data.forEach(function(weatherJSON) {
					var nextHourWeather : Weather = WeatherHelper.buildWeather(weatherJSON);

					nextHourWeather.setDurationToDisplay(parseInt(self.getParams().InfoDuration));
					nextHourWeather.setLatitude(latitude);
					nextHourWeather.setLongitude(longitude);

					forecast.addNextHour(nextHourWeather);
				});
			}

			if(typeof(forecastJSON.daily) != "undefined") {
				forecastJSON.daily.data.forEach(function(weatherJSON) {
					var nextDayWeather : Weather = WeatherHelper.buildWeather(weatherJSON);

					nextDayWeather.setDurationToDisplay(parseInt(self.getParams().InfoDuration));
					nextDayWeather.setLatitude(latitude);
					nextDayWeather.setLongitude(longitude);

					forecast.addNextDay(nextDayWeather);
				});
			}

			forecast.setDurationToDisplay(parseInt(self.getParams().InfoDuration));
			self.getSourceNamespaceManager().sendNewInfoToClient(forecast);
		};


		var forstcastIoUrl = ServiceConfig.getWeatherHost() + ServiceConfig.forecastEndpoint + ServiceConfig.getWeatherApiKey() + "/" + self.getParams().Latitude + "," + self.getParams().Longitude + "?units=si&lang=fr&exclude=flags,minutely";

		RestClient.get(forstcastIoUrl, successRetrieveForecast, fail);
	}
}
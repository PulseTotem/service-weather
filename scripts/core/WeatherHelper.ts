/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 *
 *     (Forecast.io : https://developer.forecast.io/docs/v2 )
 */

/// <reference path="../../t6s-core/core-backend/scripts/Logger.ts" />

/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/Weather.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/weather/WeatherStatus.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/weather/WeatherMoon.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/weather/WeatherPrecipitationType.ts" />
/// <reference path="../../t6s-core/core-backend/t6s-core/core/scripts/infotype/weather/WeatherWindDirection.ts" />


/**
 * Contains some helper functions to build a Weather Info Type from "Forecast.IO" response.
 *
 * @class WeatherHelper
 */
class WeatherHelper {

	/**
	 * Return Weather from JSON description in param.
	 *
	 * @method buildWeather
	 * @static
	 * @param {JSON Object} jsonDesc - JSON description from "Forecast.IO" API.
	 * @return {Weather} - Weather corresponding to JSON description.
	 */
	static buildWeather(jsonDesc : any) : Weather {
		var newWeather : Weather = new Weather();
		newWeather.setId(jsonDesc.time);

		var creationDate : any = moment(jsonDesc.time);
		newWeather.setCreationDate(creationDate.toDate());

		if(typeof(jsonDesc.summary) != "undefined") {
			newWeather.setSummary(jsonDesc.summary);
		}

		if(typeof(jsonDesc.icon) != "undefined") {
			switch(jsonDesc.icon) {
				case "clear-day" :
					newWeather.setStatus(WeatherStatus.CLEAR_DAY);
					break;
				case "clear-night" :
					newWeather.setStatus(WeatherStatus.CLEAR_NIGHT);
					break;
				case "rain" :
					newWeather.setStatus(WeatherStatus.CLOUDY);
					break;
				case "snow" :
					newWeather.setStatus(WeatherStatus.SNOW);
					break;
				case "sleet" :
					newWeather.setStatus(WeatherStatus.SLEET);
					break;
				case "wind" :
					newWeather.setStatus(WeatherStatus.WIND);
					break;
				case "fog" :
					newWeather.setStatus(WeatherStatus.FOG);
					break;
				case "cloudy" :
					newWeather.setStatus(WeatherStatus.CLOUDY);
					break;
				case "partly-cloudy-day" :
					newWeather.setStatus(WeatherStatus.PARTLY_CLOUDY_DAY);
					break;
				case "partly-cloudy-night" :
					newWeather.setStatus(WeatherStatus.PARTLY_CLOUDY_NIGHT);
					break;
				default :
					newWeather.setStatus(WeatherStatus.UNKNOWN);
			}
		}

		if(typeof(jsonDesc.sunriseTime) != "undefined") {
			newWeather.setSunriseTime(jsonDesc.sunriseTime);
		}

		if(typeof(jsonDesc.sunsetTime) != "undefined") {
			newWeather.setSunsetTime(jsonDesc.sunsetTime);
		}

		if(typeof(jsonDesc.moonPhase) != "undefined") {
			if(jsonDesc.moonPhase == 0) {
				newWeather.setMoon(WeatherMoon.NEW_MOON);
			}

			if(jsonDesc.moonPhase > 0 && jsonDesc.moonPhase < 0.25) {
				newWeather.setMoon(WeatherMoon.WAXING_CRESCENT_MOON);
			}

			if(jsonDesc.moonPhase == 0.25) {
				newWeather.setMoon(WeatherMoon.FIRST_QUARTER_MOON);
			}

			if(jsonDesc.moonPhase > 0.25 && jsonDesc.moonPhase < 0.5) {
				newWeather.setMoon(WeatherMoon.WAXING_GIBBOUS_MOON);
			}

			if(jsonDesc.moonPhase == 0.5) {
				newWeather.setMoon(WeatherMoon.FULL_MOON);
			}

			if(jsonDesc.moonPhase > 0.5 && jsonDesc.moonPhase < 0.75) {
				newWeather.setMoon(WeatherMoon.WANING_GIBBOUS_MOON);
			}

			if(jsonDesc.moonPhase == 0.75) {
				newWeather.setMoon(WeatherMoon.LAST_QUARTER_MOON);
			}

			if(jsonDesc.moonPhase > 0.75) {
				newWeather.setMoon(WeatherMoon.WANING_CRESCENT_MOON);
			}
		}

		if(typeof(jsonDesc.precipIntensity) != "undefined") {
			newWeather.setPrecipitationIntensity(jsonDesc.precipIntensity);
		}

		if(typeof(jsonDesc.precipProbability) != "undefined") {
			newWeather.setPrecipitationProbability(jsonDesc.precipProbability);
		}

		if(typeof(jsonDesc.precipType) != "undefined") {
			switch(jsonDesc.precipType) {
				case "rain" :
					newWeather.setPrecipitationType(WeatherPrecipitationType.RAIN);
					break;
				case "snow" :
					newWeather.setPrecipitationType(WeatherPrecipitationType.SNOW);
					break;
				case "sleet" :
					newWeather.setPrecipitationType(WeatherPrecipitationType.SLEET);
					break;
				case "hail" :
					newWeather.setPrecipitationType(WeatherPrecipitationType.HAIL);
					break;
				default :
					newWeather.setPrecipitationType(WeatherPrecipitationType.RAIN);
			}
		}

		if(typeof(jsonDesc.temperature) != "undefined") {
			newWeather.setTemperature(jsonDesc.temperature);
		}

		if(typeof(jsonDesc.temperatureMin) != "undefined") {
			newWeather.setTemperatureMin(jsonDesc.temperatureMin);
		}

		if(typeof(jsonDesc.temperatureMax) != "undefined") {
			newWeather.setTemperatureMax(jsonDesc.temperatureMax);
		}

		if(typeof(jsonDesc.windSpeed) != "undefined") {
			newWeather.setWindSpeed(jsonDesc.windSpeed);
		}

		if(typeof(jsonDesc.windBearing) != "undefined") {
			if(jsonDesc.windBearing) {
				//TODO
			}
		}

		if(typeof(jsonDesc.humidity) != "undefined") {
			newWeather.setHumidity(jsonDesc.humidity);
		}

		if(typeof(jsonDesc.pressure) != "undefined") {
			newWeather.setPressure(jsonDesc.pressure);
		}

		return newWeather;
	}
}
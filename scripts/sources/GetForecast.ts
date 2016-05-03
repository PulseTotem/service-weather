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
					var newCreationDate:any = moment(currentWeather.getTime());
					forecast.setCreationDate(newCreationDate.toDate());
				}
			}

			if(typeof(forecastJSON.hourly) != "undefined") {
				forecastJSON.hourly.data.forEach(function(weatherJSON) {
					var nextHourWeather : Weather = WeatherHelper.buildWeather(weatherJSON);

					forecast.addNextHour(nextHourWeather);
				});
			}

			if(typeof(forecastJSON.daily) != "undefined") {
				forecastJSON.daily.data.forEach(function(weatherJSON) {
					var nextDayWeather : Weather = WeatherHelper.buildWeather(weatherJSON);

					forecast.addNextDay(nextDayWeather);
				});
			}

			forecast.setDurationToDisplay(parseInt(self.getParams().InfoDuration));
			self.getSourceNamespaceManager().sendNewInfoToClient(forecast);

		};


		var forstcastIoUrl = ServiceConfig.getWeatherHost() + ServiceConfig.forecastEndpoint + ServiceConfig.getWeatherApiKey() + "/" + self.getParams().Latitude + "," + self.getParams().Longitude + "?units=si&lang=fr&exclude=flags,minutely";

		RestClient.get(forstcastIoUrl, successRetrieveForecast, fail);


		/*var successRetrieveAlbum = function(result) {
			var info = result.data();

			var pictureAlbum : PictureAlbum = new PictureAlbum();
			pictureAlbum.setId(info.id);
			var creationDate : any = moment(info.createdAt);
			pictureAlbum.setCreationDate(creationDate.toDate());


			var successRetrievePhotos = function(photosResult) {
				var photos = photosResult.data();

				if(photos.length > 0) {
					var pictures : Array<Picture> = new Array<Picture>();

					photos.forEach(function(image) {
						var picture : Picture = new Picture();
						picture.setId(image.id);
						var pictureCreationDate : any = moment(image.createdAt);
						picture.setCreationDate(pictureCreationDate.toDate());
						picture.setDurationToDisplay(parseInt(self.getParams().InfoDuration));

						picture.setTitle(image.name);
						picture.setDescription(image.description);

						var pictureOriginalURL : PictureURL = new PictureURL();
						pictureOriginalURL.setId(image.id + "_original");
						pictureOriginalURL.setURL(ServiceConfig.getCMSHost() + "images/" + image.id + "/raw?size=original");
						picture.setOriginal(pictureOriginalURL);

						var pictureLargeURL : PictureURL = new PictureURL();
						pictureLargeURL.setId(image.id + "_large");
						pictureLargeURL.setURL(ServiceConfig.getCMSHost() + "images/" + image.id + "/raw?size=large");
						picture.setLarge(pictureLargeURL);

						var pictureMediumURL : PictureURL = new PictureURL();
						pictureMediumURL.setId(image.id + "_medium");
						pictureMediumURL.setURL(ServiceConfig.getCMSHost() + "images/" + image.id + "/raw?size=medium");
						picture.setMedium(pictureMediumURL);

						var pictureSmallURL : PictureURL = new PictureURL();
						pictureSmallURL.setId(image.id + "_small");
						pictureSmallURL.setURL(ServiceConfig.getCMSHost() + "images/" + image.id + "/raw?size=small");
						picture.setSmall(pictureSmallURL);

						var pictureThumbURL : PictureURL = new PictureURL();
						pictureThumbURL.setId(image.id + "_thumb");
						pictureThumbURL.setURL(ServiceConfig.getCMSHost() + "images/" + image.id + "/raw?size=thumb");
						picture.setThumb(pictureThumbURL);

						pictures.push(picture);
					});

					var finalPictures : Array<Picture> = new Array<Picture>();
					if(pictures.length > parseInt(self.getParams().Limit)) {
						var resultPictures : Array<Picture> ;
						if(self.getParams().Shuffle) {
							resultPictures = self.shuffle(pictures);
						} else {
							resultPictures = pictures;
						}

						for(var i = 0; i < parseInt(self.getParams().Limit); i++) {
							finalPictures.push(resultPictures[i]);
						}
					} else {
						if(self.getParams().Shuffle) {
							finalPictures = self.shuffle(pictures);
						} else {
							finalPictures = pictures;
						}
					}

					finalPictures.forEach(function(pic : Picture) {
						pictureAlbum.addPicture(pic);
					});
				}

				pictureAlbum.setDurationToDisplay(parseInt(self.getParams().InfoDuration) * pictureAlbum.getPictures().length);
				self.getSourceNamespaceManager().sendNewInfoToClient(pictureAlbum);
			};

			var retrievePhotosUrl = ServiceConfig.getCMSHost() + "admin/images_collections/" + self.getParams().AlbumID + "/images";

			Helper.performGetRequest(retrievePhotosUrl, successRetrievePhotos, fail);
		};

		var retrieveAlbumUrl = ServiceConfig.getCMSHost() + "admin/images_collections/" + self.getParams().AlbumID;

		Helper.performGetRequest(retrieveAlbumUrl, successRetrieveAlbum, fail);*/
	}
}
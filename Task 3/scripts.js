const autocompleteUrl = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete';
const weatherUrl = 'http://dataservice.accuweather.com/currentconditions/v1/';

const locationApiKey = 'MAf2vnggl3A6niIqKT8PDD2JI677lnl1';

const searchButton = document.getElementById('searchButton');
const inputGroupSelect04 = document.getElementById('inputGroupSelect04');
const citySearchResult = document.getElementById('citySearchResult');
const weatherInfo = document.getElementById('weatherInfo');
const cardtilte = document.getElementById('cityCardTitle');

searchButton.addEventListener('click', (event) => {
    event.preventDefault();

    const inputValue = inputGroupSelect04.value;

    if (inputValue) {
        fetch(`${autocompleteUrl}?apikey=${locationApiKey}&q=${inputValue}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const city = data[0];
                    const cityKey = city.Key;
                    const cityResult = `Search result: ${city.LocalizedName}, ${city.AdministrativeArea.LocalizedName}, ${city.Country.LocalizedName}`;
                    citySearchResult.textContent = cityResult;
                    citySearchResult.addEventListener('click', () => {

                        fetch(`${weatherUrl}${cityKey}?apikey=${locationApiKey}&language=en&details=true`)
                            .then(response => response.json())
                            .then(weatherData => {
                                const condition = weatherData[0].WeatherText;
                                const weatherIcon = weatherData[0].WeatherIcon;
                                const temperature = weatherData[0].Temperature.Metric.Value + " " + weatherData[0].Temperature.Metric.Unit;
                                const feelsLike = weatherData[0].RealFeelTemperature.Metric.Value + " " + weatherData[0].RealFeelTemperature.Metric.Unit;
                                const pressure = weatherData[0].Pressure.Metric.Value + " " + weatherData[0].Pressure.Metric.Unit;
                                const humidity = weatherData[0].RelativeHumidity;
                                const airTemperature = weatherData[0].WindChillTemperature.Metric.Value + " " + weatherData[0].WindChillTemperature.Metric.Unit;
                                const windDirection = weatherData[0].Wind.Direction.English + " " + weatherData[0].Wind.Speed.Metric.Value + " " + weatherData[0].Wind.Speed.Metric.Unit;
                                const precipitation = weatherData[0].PrecipitationSummary.Precipitation.Metric.Value + " " + weatherData[0].PrecipitationSummary.Precipitation.Metric.Unit;
                                var isDayTime = weatherData[0].IsDayTime;

                                var cardBody = `
                              <p>${condition}</p>
                              <p>Temperature ${temperature}</p>
                              <p>Feels like ${feelsLike}</p>
                              <p>Wind direction ${windDirection}
                              <p>Precipitation ${precipitation}</p>
                              <p>Pressure ${pressure}</p>
                              <p>Humidity ${humidity}</p>
                              <p>Air temperature ${airTemperature}</p>
                            `;
                                if (isDayTime) {
                                    cardBody += '<p>Day</p>';
                                } else {
                                    cardBody += '<p>Night</p>';
                                }
                                cardtilte.textContent = `${city.LocalizedName}, ${city.AdministrativeArea.ID}, ${city.Country.ID}`;

                                const weatherIconClass = `wi wi-owm-${weatherIcon}`;
                                const iconHtml = `<i class="${weatherIconClass}"></i>`;

                                cardBody += `<div>${iconHtml}</div>`;

                                weatherInfo.innerHTML = cardBody;
                                citySearchResult.textContent = "";

                                const sourceLink = document.getElementById("sourceLink");
                                sourceLink.href = weatherData[0].Link;

                                const lastUpdatedElement = document.getElementById("lastUpdated");
                                const lastUpdatedTime = new Date(weatherData[0].EpochTime * 1000);
                                const localTime = lastUpdatedTime.toLocaleString();
                                lastUpdatedElement.textContent = "Last Updated: " + localTime;

                            })
                            .catch(error => {
                                console.error(error);
                                weatherInfo.textContent = 'Error occurred while fetching weather data';
                            });
                    });

                } else {
                    citySearchResult.textContent = 'No results found';
                }
            })
            .catch(error => {
                console.error(error);
                citySearchResult.textContent = 'Error occurred while fetching data';
            });
    } else {
        citySearchResult.textContent = 'Please enter a city name';
    }
});
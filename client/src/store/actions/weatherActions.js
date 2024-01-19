// Action Types
const FETCH_WEATHER_REQUEST = 'FETCH_WEATHER_REQUEST';
const FETCH_WEATHER_SUCCESS = 'FETCH_WEATHER_SUCCESS';
const FETCH_WEATHER_FAILURE = 'FETCH_WEATHER_FAILURE';

// Action Creators
const fetchWeatherRequest = () => ({
  type: FETCH_WEATHER_REQUEST,
});

const fetchWeatherSuccess = (weatherData) => ({
  type: FETCH_WEATHER_SUCCESS,
  payload: weatherData,
});

const fetchWeatherFailure = (error) => ({
  type: FETCH_WEATHER_FAILURE,
  payload: error,
});

// Asynchronous Action Creator using Thunk
export const fetchWeather = () => {
  return async (dispatch) => {
    dispatch(fetchWeatherRequest());

    try {
      const response = await fetch(
        'https://api.ipgeolocation.io/ipgeo?apiKey=39aa7b698f7c4fc2b1d82868f1588880',
      );
      const data = await response.json();
      const lat = data.latitude;
      const long = data.longitude;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=98a669420d5fd3441c7e30d6d2e9844f`;

      const weather = await fetch(apiUrl);
      const weatherData = await weather.json();
      dispatch(fetchWeatherSuccess(weatherData));
    } catch (error) {
      dispatch(fetchWeatherFailure(error.message));
    }
  };
};

export const refreshWeather = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        'https://api.ipgeolocation.io/ipgeo?apiKey=39aa7b698f7c4fc2b1d82868f1588880',
      );
      const data = await response.json();
      const lat = data.latitude;
      const long = data.longitude;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=98a669420d5fd3441c7e30d6d2e9844f`;

      const weather = await fetch(apiUrl);
      const weatherData = await weather.json();
      dispatch(fetchWeatherSuccess(weatherData));
    } catch (error) {
      dispatch(fetchWeatherFailure(error.message));
    }
  };
};

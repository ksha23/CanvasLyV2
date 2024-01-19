import { connect } from 'react-redux';
import { useLayoutEffect } from 'react';
import { fetchWeather } from '../store/actions/weatherActions';

const Weather = ({ weatherData, isLoading, error, fetchWeather }) => {
  useLayoutEffect(() => {
    if (weatherData) return;
    fetchWeather();
  }, []);
  return (
    <>
      <div className="px-6 py-4 flex justify-center flex-col border-md text-zinc-700 dark:text-zinc-200 rounded-lg border border-zinc-300 dark:border-zinc-600 max-w-xs w-full">
        <div className="flex justify-between items-center w-full mb-2">
          <div className="flex text-left">
            <div className="flex items-center">
              {weatherData && (
                <img
                  className="w-10 h-10 scale-150"
                  src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@2x.png`}
                />
              )}
              <div className="flex flex-col ml-2">
                <p className="text-xl md:text-2xl font-semibold">
                  {weatherData?.name || 'Loading'}
                </p>
                <p className="text-xs">Approximate Location</p>
              </div>
            </div>
          </div>
          <p className="text-4xl font-semibold">
            {((weatherData?.main.temp - 273.15) * 1.8 + 32).toFixed(0) || 'Loading'}&deg;
          </p>
        </div>
        <div className="text-sm">
          <div className="flex justify-between">
            <p>{weatherData?.weather[0].main || 'Loading'}</p>
            <p>Humidity: {weatherData?.main.humidity || 'Loading'}%</p>
          </div>
          <div className="flex justify-between">
            <p className="flex mb-1">
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M12 10V3M12 3L9 6M12 3L15 6M6 12L5 11M18 12L19 11M3 18H21M5 21H19M7 18C7 15.2386 9.23858 13 12 13C14.7614 13 17 15.2386 17 18"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
              {new Date(weatherData?.sys.sunrise * 1000).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              }) || 'Loading'}
            </p>
            <p className="flex">
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <path
                      d="M6 12L5 11M18 12L19 11M3 18H21M5 21H19M7 18C7 15.2386 9.23858 13 12 13C14.7614 13 17 15.2386 17 18M12 3V10M12 10L15 7M12 10L9 7"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{' '}
                  </g>
                </svg>
              </div>
              {new Date(weatherData?.sys.sunset * 1000).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              }) || 'Loading'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  weatherData: state.weather.weatherData,
  isLoading: state.weather.isLoading,
  error: state.weather.error,
});

export default connect(mapStateToProps, { fetchWeather })(Weather);

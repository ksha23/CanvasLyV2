import { useEffect, useState } from 'react';

const Weather = ({ weatherData }) => {
  return (
    <>
      {weatherData && (
        <div className="flex justify-center flex-col border-md bg-zinc-100 dark:bg-zinc-900 mx-5 my-5 md:my-10 rounded-lg max-w-sm w-full">
          <div className="flex justify-between w-full bg-gradient-to-bl from-blue-600 via-blue-700 to-gray-700 dark:to-gray-800 text-white text-lg font-bold px-4 py-2 rounded-tr-lg rounded-tl-lg">
            <p className="">{weatherData.name}</p>
            {((weatherData.main.temp - 273.15) * 1.8 + 32).toFixed(2)} &deg;F
            {/*also in farhenheit: {(weatherData.main.temp - 273.15) * 1.8 + 32} &deg;F*/}
          </div>
          <div className="p-5 text-zinc-600 dark:text-zinc-300">
            <div className="flex justify-between mb-2 md:mb-0">
              <p>
                <strong>Forecast: </strong>
                {weatherData.weather[0].main}
              </p>
              <p>
                <strong>Humidity: </strong>
                {weatherData.main.humidity}%
              </p>
            </div>

            <div className="md:flex justify-between">
              <p className="">
                <strong>Sunrise: </strong>
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="">
                <strong>Sunset: </strong>
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Weather;

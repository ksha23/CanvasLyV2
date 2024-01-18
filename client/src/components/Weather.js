import { useEffect, useState } from 'react';

const Weather = ({ weatherData }) => {
  return (
    <>
      {weatherData && (
        <div className="p-5 flex justify-center flex-col border-md bg-zinc-100 dark:bg-zinc-800 mx-5 my-5 md:my-10 rounded-lg max-w-xs w-full border border-zinc-300 dark:border-zinc-600">
          <div className="flex justify-between items-center w-full mb-2">
            <div className="flex flex-col text-left">
              <p className="text-xl md:text-2xl font-bold">My Location</p>
              <p className="text-xs">{weatherData.name}</p>
            </div>
            <p className="text-4xl font-semibold">
              {((weatherData.main.temp - 273.15) * 1.8 + 32).toFixed(0)}&deg;
            </p>
          </div>
          <div className="text-zinc-600 dark:text-zinc-300">
            <div className="flex justify-between mb-2">
              <p>{weatherData.weather[0].main}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
            </div>

            <div className="flex justify-between">
              <p className="flex">
                <div className="w-6 h-6">
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
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="flex">
                <div className="w-6 h-6">
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

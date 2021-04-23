import axios from 'axios';
import { OPEN_WEATHER_MAP_BASE_URL, OPEN_WEATHER_MAP_TIMEOUT_MESSAGE } from '../utils/constants';

const OpenWeatherMapApi = axios.create({
    baseURL: OPEN_WEATHER_MAP_BASE_URL,
    method: 'get',
    params: {
        appid: process.env.REACT_APP_OPEN_WEATHER_APP_ID,
        units: 'metric',
    },
    timeout: 2000,
    timeoutErrorMessage: OPEN_WEATHER_MAP_TIMEOUT_MESSAGE,
});

export default OpenWeatherMapApi;

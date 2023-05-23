import {getCountries} from "@/models";

const getWeather = async (country) => {
    const API_key = '9e034f3d62c56dbed1e2cef5bb13b3f1';
    return await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${country.capital},${country.countryCode}&units=metric&appid=${API_key}`
    ).then((response) => response.json()).then((data) => {
        // calculate the min and max temperature and most common weather condition for each day in the next 5 days
        const minMaxTemp = [];
        const weatherData = data.list;
        let currentDay = weatherData[0].dt_txt.split(' ')[0];
        let min = weatherData[0].main.temp_min;
        let max = weatherData[0].main.temp_max;
        let weatherConditions = {
            [weatherData[0].weather[0].icon]: 1,
        }
        weatherData.forEach((interval) => {
            const day = interval.dt_txt.split(' ')[0];
            if (day !== currentDay) {
                minMaxTemp.push({
                    date: currentDay,
                    min: min,
                    max: max,
                    icon: Object.keys(weatherConditions).reduce((a, b) => weatherConditions[a] > weatherConditions[b] ? a : b),
                });
                currentDay = day;
                min = interval.main.temp_min;
                max = interval.main.temp_max;
                weatherConditions = {
                    [interval.weather[0].icon]: 1,
                }
            } else {
                min = Math.min(min, interval.main.temp_min);
                max = Math.max(max, interval.main.temp_max);
                if (weatherConditions[interval.weather[0].icon]) {
                    weatherConditions[interval.weather[0].icon]++;
                } else {
                    weatherConditions[interval.weather[0].icon] = 1;
                }
            }
        });
        return minMaxTemp;
    });
}

const getCurrencyRate = async (country) => {
    const API_key = 'e54702ffaad5e284925d';
    return await fetch(
        `https://free.currconv.com/api/v7/convert?q=${country.currency}_EGP&compact=ultra&apiKey=${API_key}`,
    ).then((response) => response.json());
}

const recommendDishes = async (country) => {
    return await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${country.mealDB}`,
    ).then((response) => response.json()).catch((error) => {
            console.log(error);
            return {
                meals: [],
            };
        }
    );
}


export default async function handler(req, res) {
    const country = req.query.country;

    const countryData = await getCountries(country);

    if (countryData.length === 0) {
        res.status(404).json({error: 'Country not found'});
        return;
    }
    const Country = {
        name: countryData.name,
        capital: countryData.capital,
        countryCode: countryData.countryCode,
        currency: countryData.currency,
        flag: countryData.flag,
        language: countryData.language,
        hotelAveragePrice: countryData.hotelAveragePrice,
        flightAveragePrice: countryData.flightAveragePrice,
        description: countryData.description,
        mealDB: countryData.mealDB,
    }


    Country.weather = await getWeather(Country);
    const currency_rate = await getCurrencyRate(Country);
    Country.currencyRate = currency_rate[`${Country.currency}_EGP`];
    // round the currency rate to 2 decimal places
    Country.currencyRate = Math.round(Country.currencyRate * 100) / 100;
    const meals = await recommendDishes(Country);
    Country.meals = meals.meals ? meals.meals : [];

    res.status(200).json({country: Country});
}
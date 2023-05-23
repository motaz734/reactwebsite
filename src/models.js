const dbConn = require("./db_conn");
const {model} = require("mongoose");
const mongoose = require("mongoose");

const {Schema} = mongoose;

function createCountrySchema() {
    const CountrySchema = new Schema({
        name: String,
        capital: String,
        countryCode: String,
        currency: String,
        flag: String,
        language: String,
        hotelAveragePrice: Number,
        flightAveragePrice: Number,
        description: String,
        mealDB: String,
    });

    const Country = model("Country", CountrySchema);
    return Country;
}

if (!mongoose.models.Country) {
    createCountrySchema();
}

export async function getCountries(countryName = null, budget = null) {
    await dbConn();
    if (countryName) {
        return model("Country").findOne({name: countryName});
    } else if (budget) {
        // get countries where hotelAveragePrice + flightAveragePrice <= budget
       const countries = await model("Country").find();
       const filteredCountries = []
         countries.forEach((country) => {
              if (country.hotelAveragePrice + country.flightAveragePrice <= budget) {
                 filteredCountries.push(country);
                }
            });
        return filteredCountries;

    } else {
        return model("Country").find();
    }
}
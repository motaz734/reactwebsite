import {getCountries} from "@/models";

export default async function handler(req, res) {
    const countries = await getCountries();
    const countriesNames = countries.map((country) => country.name);
    res.status(200).json({countries: countriesNames});
}
import {getCountries} from "@/models";

export default async function handler(req, res) {
    const budget = req.query.budget;

    const countries = await getCountries(null, budget);

    if (countries.length === 0) {
        res.status(404).json({error: 'No countries found'});
        return;
    }

    res.status(200).json({countries: countries});
}
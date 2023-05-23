const mongoose = require("mongoose");

const dbConn = async () => {
    try {
        await mongoose.connect("mongodb+srv://dbUser:BLXNQYcB6S8QfB6v@cluster0.crrggdz.mongodb.net/BudgetEstimator", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error connecting to DB");
        console.log(error);
    }
};

module.exports = dbConn;
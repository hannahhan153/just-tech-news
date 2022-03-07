const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
// force: false is a configuration parameter; by changing it to true, the database connection must sync with the model definitions and associations, by forcing the sync method to true, we will make the tables re-create if there are any association changes similar to DROP TABLE IF EXISTS; overwritten and re-created
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');

const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// turn on routes
app.use(require('./controllers'));

// turn on connection to db and server
// force: false is a configuration parameter; by changing it to true, the database connection must sync with the model definitions and associations, by forcing the sync method to true, we will make the tables re-create if there are any association changes similar to DROP TABLE IF EXISTS; overwritten and re-created
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});
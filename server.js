const express = require('express');

// use this to be able to access the body of the request i.e. the city that the user enters for the weather-app
const bodyParser = require('body-parser');

// use this to set up the POST request for the user input
const request = require('request');

// use this require line to call in the private variable from the .env file within the project
require('dotenv').config();

// instance of the express class for the app is initialised
const app = express()

// private key variable
const apiKey = process.env.API_KEY;

// the app used to access the static css file 
app.use(express.static('public'));

// encoding the req.body object
app.use(bodyParser.urlencoded({ extended: true }));

// set up the template engine, have the variable passed from the view as a template, render to a html file back to the client from the this file
app.set('view engine', 'ejs')

// just returns the rendered html with the form input
app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

// POST method that enters in the city of the user's choice
app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees (celsius) in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

const express = require("express")

const https = require('https');
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')

})

app.post("/", function(req, res){
    const city = req.body.cityName
    const apiKey = "17c6fe1cd23655b9668e47afe891c9da"
    const units = "imperial"

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city+ "&units=" + units + "&appid=" + apiKey;
    https.get(url, function(response){
        console.log(response.statusCode)
        response.on("data", function(data){
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const description = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            res.write("<p>The weather is currently " + description + "</p>")
           res.write("<h1>The current temperature in " + city + " is " + temp + " degrees F</h1>")
           res.write("<img src=" + imageURL + ">")
           res.send()
       })
    })

})

app.listen(3000, function(){
    console.log("Server running on port 3000")
})
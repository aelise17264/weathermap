const express = require("express")
const path = require("path")
const https = require('https');
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')

})

app.use(express.static('public'))
app.use(express.static('files'))

app.use('/static', express.static(path.join(__dirname, '/public/')))

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/" + "style.css");
  });

  
app.post("/", function(req, res){
    const city = req.body.cityName
    const apiKey = "17c6fe1cd23655b9668e47afe891c9da"
    const units = "imperial"

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city+ "&units=" + units + "&appid=" + apiKey;
    https.get(url, function(response){
        //console.log(response.statusCode)

        response.on("data", function(data){
     
            const weatherData = JSON.parse(data)
            const temp = Math.floor(weatherData.main.temp)
            const feel= Math.floor(weatherData.main.feels_like)
            const description = weatherData.weather[0].description
            const wind = weatherData.wind.speed
            const icon = weatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            
            res.write("<div class='weatherReport'>")
            res.write("<h1>The weather is currently " + description + " in " + city + "</h1>")
            res.write("<img src=" + imageURL + ">")
            res.write("<h2>The current temperature is " + temp + " degrees F</h2>")
           res.write("<h3>It feels like " + feel + " out there")
            if(feel < 32){
                res.write("<h3>It's cold out there. Make sure to wear your mittens!</h3>")
            }else if(feel > 75){
                res.write("<h3>It's a hot one out there. Make sure you put on some sunscreen!</h3>")
            }else{
                res.write("<h3>It's a nice day outside!</h3>")
            }

           res.write("<h3>Wind speed of " + wind + " mph </h3>")
           res.write("<p>To search a new city click the back arrow</p>")
           res.write("</div>")
           res.send()
       })
    })

})

app.listen(3000, function(){
    console.log("Server running on port 3000")
})
$(document).ready(function () {

    var searches = JSON.parse(localStorage.getItem("searches")) || [];

    $("#main").hide();

    function renderHistory() {
        $("#history").empty();
        for (var i = 0; i < searches.length; i++) {
            $("#history").prepend($("<button>").text(searches[i]).attr("data-value", searches[i]).addClass("button"));
        }
    };

    $("form").on("submit", function (event) {
        $("#main").show();
        event.preventDefault();
        var city = $("#city").val().trim();
        searches.push(city);

        localStorage.setItem("searches", JSON.stringify(searches));

        $("#city").val("");
        renderHistory();
        getWeather(city);
    });


    $(document).on("click", ".button", function () {
        $("#main").show();
        var city = $(this).attr("data-value");
        console.log(city);
        getWeather(city);
    })

    function getWeather(city) {

        $("#days").empty();
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=9593ce48f1b1842d5ba8263f55137b00",
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var lat = response.coord.lat;
            var long = response.coord.lon;

            $("#inputCity").text(response.name + " Weather");
            $("#currentDate").text(new Date());
            $("#currentIcon").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            $("#inputTemp").text("Temperature: " + Math.floor(response.main.temp));
            $("#inputHum").text("Humidity: " + response.main.humidity + "%");
            $("#inputWind").text("Wind speed: " + Math.floor(response.wind.speed) + "mph");

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=9593ce48f1b1842d5ba8263f55137b00&lat=" + lat + "&lon=" + long,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                $("#inputUV").text("UV index: " + Math.floor(response.value));
            })
        });
 
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=9593ce48f1b1842d5ba8263f55137b00",
            method: "GET"
        }).then(function (response) {
            console.log(response);
            
            var dataArray = [response.list[4], response.list[12], response.list[20], response.list[28], response.list[36]];
            var $newH1 = $("<h1>").text("5 Day Weather").css({ "text-decoration": "underline" });
            $("#days").append($newH1);
           
            dataArray.forEach(function (arrItem) {
                var $div = $("<div>").addClass("text");
                var $date = $("<p>").text(arrItem.dt_txt.split(" ")[0]);
                var $icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + arrItem.weather[0].icon + "@2x.png");
                var $temp = $("<p>").text("Temp: " + Math.floor(arrItem.main.temp));
                var $humidity = $("<p>").text("Humidity: " + arrItem.main.humidity + "%");
                var $wind = $("<p>").text("Wind: " + arrItem.wind.speed + "MPH");
                $div.append($date, $icon, $temp, $humidity, $wind);
                $("#days").append($div);
            })
        });
    };

    renderHistory();
});
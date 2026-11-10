searchBtn.addEventListener("click", function() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        cityInput.value = "";
    } else {
        alert("Please enter a city name.");
    }
});

cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchBtn.click(); // Automatically clicks the search button above!
    }
});

const apiKey = "741480d2df721c15f3c955af6e917792";

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        
        // Basic check: agar city wrong ho
        if (!response.ok) {
            alert("City not found!");
            return;
        }

        const data = await response.json();

        // Direct DOM update
        document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("tempDisplay").textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById("weatherCondition").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
        document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    } catch (error) {
        alert("Something went wrong while fetching data.");
    }
}
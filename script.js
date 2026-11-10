// 1. Credentials & Configuration
const apiKey = "741480d2df721c15f3c955af6e917792";

// 2. DOM Elements (Select FIRST before adding listeners)
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const recentList = document.getElementById("recentList");

// 3. Main Async Fetch Function
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            alert("City not found!");
            return;
        }

        const data = await response.json();

        // Direct DOM Updates
        document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("tempDisplay").textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById("weatherCondition").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
        document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Save to Recent Searches
        saveRecentSearch(data.name);

    } catch (error) {
        alert("Something went wrong while fetching data.");
    }
}

// 4. LocalStorage Handlers
function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    searches = searches.filter(item => item.toLowerCase() !== city.toLowerCase());
    searches.unshift(city);
    searches = searches.slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(searches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    recentList.innerHTML = "";

    searches.forEach(city => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = city;

        btn.addEventListener("click", () => {
            fetchWeather(city);
        });

        recentList.appendChild(btn);
    });
}

// 5. Event Listeners
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
        searchBtn.click();
    }
});


renderRecentSearches();
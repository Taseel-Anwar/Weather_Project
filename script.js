// 1. Configuration & Credentials
const apiKey = "741480d2df721c15f3c955af6e917792";

// 2. DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const recentList = document.getElementById("recentList");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const loader = document.getElementById("loader");
const weatherCard = document.getElementById("weatherCard");
const errorMsg = document.getElementById("errorMsg");

// 3. Main Async Fetch Function with Loader & UI Toggle
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // START LOADING STATE
    if (loader) loader.style.display = "flex";
    if (weatherCard) weatherCard.style.display = "none";
    if (errorMsg) errorMsg.style.display = "none";

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (errorMsg) errorMsg.style.display = "block";
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

        // Save valid search to LocalStorage
        saveRecentSearch(data.name);

        // SHOW WEATHER CARD ON SUCCESS
        if (weatherCard) weatherCard.style.display = "block";

    } catch (error) {
        if (errorMsg) errorMsg.style.display = "block";
    } finally {
        // STOP LOADING STATE (runs on both success & failure)
        if (loader) loader.style.display = "none";
    }
}

// 4. LocalStorage & Recent Searches Logic
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

// 5. Dark / Light Theme Toggle Logic
function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark-mode");
        if (themeToggleBtn) themeToggleBtn.className = "fa-solid fa-sun theme-icon";
    } else {
        document.body.classList.remove("dark-mode");
        if (themeToggleBtn) themeToggleBtn.className = "fa-solid fa-moon theme-icon";
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark-mode");
        setTheme(isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme === "dark");
}

// 6. Event Listeners
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

// Initial Executions on Page Load
loadSavedTheme();
renderRecentSearches();
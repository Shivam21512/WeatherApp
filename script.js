const API_KEY = "4a92512ec822f62b149da56cf82e1014";

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially variables need

let oldTab = userTab;
//const API_KEY = "168771779c71f3d64106d8a88376808a";
//const API_KEY = "4a92512ec822f62b149da56cf82e1014";
oldTab.classList.add("current-tab");
getfromSessionsStorage();
 
function switchTab(newTab) {
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //kya search form wala container is invisible ,if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main pehle search wale tab pr tha, ab your weather tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            // ab main your tab me aagya hu, toh weather bhi display karna poadega , so lets check local storage 
            // first for coordinates, if we haved saved them there
            getfromSessionsStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
} );

searchTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
} );

// Check if cordinates are alredy present in session storage
function getfromSessionsStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
       if(!localCoordinates){
        // agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
       }
       else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
       }
}

async function fetchUserWeatherInfo(coordinates){

    const {lat, lon} = coordinates;
      // make grantcontainer invisible
      grantAccessContainer.classList.remove("active");
      //make loader visible
      loadingScreen.classList.add("active");

      //API CALL
      try{
        // const response = await fetch(
        //     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        // );
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

      }
      catch(err){
        //loadingScreen.classList.remove("active");

      }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

     // Fetch values from weather Info object and put it UI elements
     cityName.innerText = weatherInfo?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText = weatherInfo?.weather?.[0]?.description;
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
     temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
     windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
     humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
     cloudiness.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
 }

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // show an alert for no geolocation support available
    }
}

function showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

 const grantAccessButton = document.querySelector("[data-grantAccess]");
 grantAccessButton.addEventListener("click", getLocation);

 const searchInput = document.querySelector("[data-searchInput]");

 searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
    fetchSearchWeatherInfo(cityName);

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        // const response = await fetch(
        //     `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);     
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);  
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }

}
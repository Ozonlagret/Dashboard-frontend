// Time and date

let currentTime = document.getElementById('time');
let currentDate = document.getElementById('date');

function Time() {
    let date = new Date();
    currentTime.innerHTML = date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
    currentDate.innerHTML = date.toLocaleDateString();
}

setInterval(Time, 1000) 


// Title bar _________________________________________________________________________________

const title = document.getElementById('title');
if (localStorage.getItem('title')) {
    title.innerText = localStorage.getItem('title');
}

function saveTitle() {
    localStorage.setItem('title', title.innerText);
}

title.addEventListener('input', saveTitle)

// Quick links ______________________________________________________________________________
 
let counter = 0;
let url = "";
let regex = /^(https?:\/\/)?(?:www\.)?([^\/]+)\.[a-z]+/;
let extractedText = "";
let input = document.getElementById('linkInput');
let linkContainer = document.getElementById('linkContainer');
let linkForm = document.getElementById('linkForm');
let linkArray = JSON.parse(localStorage.getItem('savedLinks')) || [];

linkArray.forEach(url => {
    addLink(url);
});

linkForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let urlValue = input.value.trim();
    
    if (!urlValue.startsWith('https://') && !urlValue.startsWith('http://')){
        urlValue = 'https://' + urlValue;
    }

    let match = urlValue.match(regex);

    if (match && !linkArray.includes(urlValue)) {
        extractedText = match[2];
        console.log("Extracted text:", extractedText); 

        linkArray.push(urlValue);
        localStorage.setItem('savedLinks', JSON.stringify(linkArray));

        addLink(urlValue);

        input.value = "";
    }
    else if (linkArray.includes(urlValue)) {
        alert("Länken finns redan")
    }
    else {
        alert("Ogiltig URL");
    }
    
});

function addLink(url) {
    let match = url.match(regex);
    if (match) {
        let extractedText = match[2];

        let linkBubble = document.createElement('div');
        linkBubble.className = 'linkBubble';

        let cutUrl = url.replace(/^https?:\/\//, '');
        let img = document.createElement('img');
        img.src = `https://www.google.com/s2/favicons?domain=${cutUrl}`;
        img.className = 'favicon';
        linkBubble.appendChild(img);

        let textNode = document.createTextNode(extractedText);
        linkBubble.appendChild(textNode);

        let removeButton = document.createElement('button');
        removeButton.textContent = '-';
        removeButton.className = 'removeButton';
        linkBubble.appendChild(removeButton);

        removeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            linkArray = linkArray.filter(item => item !== url);
            localStorage.setItem('savedLinks', JSON.stringify(linkArray));

            linkContainer.removeChild(linkBubble);
        });

        linkBubble.addEventListener('click', function(){
            let fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'https://' + url;
            window.open(fullUrl, '_blank');
        });

        linkContainer.appendChild(linkBubble);
    }
}
// Vädur _______________________________________________________________________

const apiKey = "5fd94a5f6761c42378ed268467165e3e";

let savedLatitude = localStorage.getItem("latitude");
let savedLongitude = localStorage.getItem("longitude");

async function fetchWeather(latitude, longitude) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}&units=metric&lang=sv`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Kunde inte hämta väderinfo");
        }
        const weatherData = await response.json();
        console.log(weatherData);

        const weatherAtNoon = weatherData.list.filter(item => item.dt_txt.includes("12:00:00"));
        const days = weatherAtNoon.slice(0, 5);

        days.forEach((data, index) => {
            const date = new Date(data.dt * 1000);
            const weekday = date.toLocaleString("sv-SE", { weekday: "long" });

            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            const tempDay = document.getElementById(`tempDay${index + 1}`);
            const weatherDay = document.getElementById(`weatherDay${index + 1}`);
            const weatherIcon = document.getElementById(`weatherIcon${index + 1}`);

            if (index >= 2) {
                const dayLabel = document.getElementById(`day${index + 1}`);
                dayLabel.textContent = weekday;
            }

            tempDay.textContent = `${temperature} °C`;
            weatherDay.textContent = description;
            weatherIcon.src = iconUrl;
        });
    } catch (error) {
        console.error(error);
    }
}

const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    
    fetchWeather(latitude, longitude);
};

const error = (err) => {
    console.log(err);
};

if (savedLatitude && savedLongitude) {
    fetchWeather(savedLatitude, savedLongitude);
} else {
    navigator.geolocation.getCurrentPosition(success, error);
}

// Notes _____________________________________________________________________________

const textArea = document.getElementsByName('textArea')[0];
textArea.value = localStorage.getItem('savedTextArea') || '';

textArea.addEventListener('input', function(){
    localStorage.setItem('savedTextArea', textArea.value);
})


// Random background _________________________________________________________________

const randomButton = document.getElementById('randomButton');
const randomImage = document.getElementById('randomImage');
const accessKey = '591v-fAbfsrJVcbLAs2IWVzbGRXZnxk5rAGw8DS3Fxo';

window.onload = async () => {
    let generateRandomImage = await fetchRandomBackground();
    if (generateRandomImage) {
        randomImage.src = generateRandomImage;
    }
}

randomButton.addEventListener('click', async () => {
    let generateRandomImage = await fetchRandomBackground();
    if (generateRandomImage) {
        randomImage.src = generateRandomImage;
    }
})

async function fetchRandomBackground() {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}`);
        const data = await response.json();

        if (!response.ok){
            throw new Error("Kunde inte hitta bakgrund");
        }
        return data.urls.regular;
    }
    catch (error){
        console.error(error);
        return null;
    }
}


// joke api _________________________________________________________________________

const jokeApiKey = 'eeecf7b9bc1045a5a037a9b36a5d318c';
const jokeButton = document.getElementById('jokeButton');
const jokeText = document.getElementById('jokeText');

const savedJoke = localStorage.getItem("lastJoke");
if (savedJoke) {
  jokeText.textContent = savedJoke;
}

jokeButton.addEventListener('click', generateJoke);


async function generateJoke() {
    try {
        const response = await fetch(`https://api.humorapi.com/jokes/random?api-key=${jokeApiKey}`);
        const data = await response.json();

        if (!response.ok){
            throw new Error("Kunde inte generera skämt");
        }

        jokeText.textContent = data.joke;
        localStorage.setItem("lastJoke", data.joke);
    }
    catch (error) {
        console.error(error);
    }
}

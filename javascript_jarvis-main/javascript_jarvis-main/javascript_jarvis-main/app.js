const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text){
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe(){
    var day = new Date();
    var hour = day.getHours();

    if(hour >= 0 && hour < 12){
        speak("Good Morning Boss...");
    }
    else if(hour >= 12 && hour < 17){
        speak("Good Afternoon Master...");
    }
    else{
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', ()=>{
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});

function takeCommand(message){
    if(message.includes('hey') || message.includes('hello')){
        speak("Hello Sir, How May I Help You?");
    }
    else if(message.includes("open google")){
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    }
    else if(message.includes("open youtube")){
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    }
    else if(message.includes("open facebook")){
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    }
    else if(message.includes('minimize')) {
        minimizeWindow();
        speak("Minimizing window");
    }
    else if(message.includes('maximize')) {
        maximizeWindow();
        speak("Maximizing window");
    }
    else if(message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        fetchWikipediaData(message.replace(/what is|who is|what are/, '').trim());
    }
    else if(message.includes('wikipedia')) {
        fetchWikipediaData(message.replace("wikipedia", "").trim());
    }
    else if(message.includes('time')) {
        const time = new Date().toLocaleString(undefined, {hour: "numeric", minute: "numeric"});
        speak("The time is " + time);
    }
    else if(message.includes('date')) {
        const date = new Date().toLocaleString(undefined, {month: "short", day: "numeric"});
        speak("Today is " + date);
    }
    else if(message.includes('calculator')) {
        window.open('Calculator:///');
        speak("Opening Calculator");
    }
    else if(message.includes('weather')) {
        getWeather();
    }
    else {
        speak("I found some information for " + message + " on Google.");
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
    }
}

function minimizeWindow() {
    window.blur();  // Lose focus from the current window (simulate minimizing)
}

function maximizeWindow() {
    window.focus();  // Gain focus to the current window (simulate maximizing)
}

function fetchWikipediaData(query) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.extract) {
                speak(data.extract);
            } else {
                speak("Sorry, I couldn't find any information on " + query);
            }
        })
        .catch(error => {
            speak("Sorry, I couldn't retrieve the information.");
            console.error("Error fetching data:", error);
        });
}

function getWeather() {
    const apiKey = 'your_openweathermap_api_key';  // Replace with your actual API key
    const city = 'your_city';  // Replace with the desired city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.weather) {
                speak(`The weather in ${city} is ${data.weather[0].description} with a temperature of ${data.main.temp} degrees Celsius.`);
            } else {
                speak("Sorry, I couldn't retrieve the weather information.");
            }
        })
        .catch(error => {
            speak("Sorry, there was an error retrieving the weather.");
            console.error("Error fetching weather data:", error);
        });
}
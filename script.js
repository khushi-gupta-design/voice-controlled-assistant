setTimeout(() => {
  document.querySelector("#introScreen").style.display = "none";
  document.querySelector("#mainScreen").style.display = "flex";
}, 5000);
// ---------- INTRO SCREEN: Typewriter effect ----------

function typeWriter(text, elementId, speed) {
  let i = 0;
  const element = document.querySelector(elementId);

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}

typeWriter("Voice Controlled Assistant", "#typedText", 80);


setTimeout(() => {
  document.querySelector("#introScreen").style.display = "none";
  document.querySelector("#mainScreen").style.display = "flex";
}, 5000);

// ---------- MAIN SCREEN: Elements ----------

const textInput = document.querySelector("#textInput");
const askBtn = document.querySelector("#askBtn");
const voiceBtn = document.querySelector("#voiceBtn");
const responseEl = document.querySelector("#response");

// ---------- Voice Input (Speech Recognition) ----------

const recognition = new webkitSpeechRecognition();
recognition.lang = "en-US";

voiceBtn.addEventListener("click", () => {
  recognition.start();
  voiceBtn.classList.add("listening");
});

recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  textInput.value = spokenText;
  askQuestion(spokenText);
  voiceBtn.classList.remove("listening");
};

recognition.onerror = (event) => {
  voiceBtn.classList.remove("listening");
  if (event.error === "not-allowed") {
    responseEl.textContent = "Mic permission is denied, allow it from settings.";
  } else if (event.error === "no-speech") {
    responseEl.textContent = "Please speak again";
  } else if (event.error === "network") {
    responseEl.textContent = "Please check your internet connection";
  } else {
    responseEl.textContent = "Voice is not clear, try again";
  }
};

recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  textInput.value = spokenText;
  askQuestion(spokenText);
};
  recognition.onerror = (event) => {
  if (event.error === "not-allowed") {
    responseEl.textContent = "Mic permission is denied , allow it from settings.";
  } else if (event.error === "no-speech") {
    responseEl.textContent = "Please speak again";
  } else if (event.error === "network") {
    responseEl.textContent = "Please check your internet connection";
  } else {
    responseEl.textContent = "Voice is not clear, try again";
  }
};




askBtn.addEventListener("click", () => {
  const question = textInput.value;
  askQuestion(question);
});

// ---------- Fetch answer from Wikipedia ----------

async function askQuestion(question) {
  responseEl.textContent = "Thinking...";
  const lowerQ = question.toLowerCase();

  if (lowerQ.includes("time")) {
    const now = new Date();
    const answer = `The current time is ${now.toLocaleTimeString()}`;
    responseEl.textContent = answer;
    speak(answer);
    return;
  }

  if (lowerQ.includes("weather")) {
    getWeather();
    return;
  }

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${question}&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    const topResult = searchData.query.search[0].title;

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${topResult}`;
    const summaryResponse = await fetch(summaryUrl);
    const summaryData = await summaryResponse.json();

    const answer = summaryData.extract;
    responseEl.textContent = answer;
    speak(answer);

  } catch (error) {
    responseEl.textContent = "Sorry, I don't get answer ";
  }
}

function getWeather() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(weatherUrl);
    const data = await response.json();

    const temp = data.current_weather.temperature;
    const answer = `The current temperature is ${temp} degrees Celsius`;
    responseEl.textContent = answer;
    speak(answer);
  }, (error) => {
  console.log(error);
  responseEl.textContent = "Location access denied, .";
});;
}

// ---------- Speak the answer (Text to Speech) ----------

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}
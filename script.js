async function searchWord() {
  const word = document.getElementById("wordInput").value.trim();
  if (!word) return alert("Please enter a word.");

  const wordTitle = document.getElementById("wordTitle");
  const definition = document.getElementById("definition");
  const partOfSpeech = document.getElementById("partOfSpeech");
  const verbForms = document.getElementById("verbForms");
  const synonyms = document.getElementById("synonyms");
  const antonyms = document.getElementById("antonyms");

  wordTitle.textContent = word;

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    const entry = data[0];
    const meaning = entry.meanings[0];

    partOfSpeech.textContent = meaning.partOfSpeech;
    definition.textContent = meaning.definitions[0].definition;
    synonyms.textContent = (meaning.synonyms || []).slice(0, 5).join(", ") || "N/A";
    antonyms.textContent = (meaning.antonyms || []).slice(0, 5).join(", ") || "N/A";

    // Check verb forms
    if (meaning.partOfSpeech === "verb") {
      const forms = meaning.definitions[0].definition.match(/\b\w+ed\b|\b\w+ing\b/g) || [];
      verbForms.textContent = forms.join(", ") || "N/A";
    } else {
      verbForms.textContent = "N/A";
    }

    // Store audio URL
    const audioData = entry.phonetics.find(p => p.audio);
    localStorage.setItem("audioUrl", audioData ? audioData.audio : "");

  } catch (error) {
    alert("Word not found or API error.");
    console.error(error);
  }
}

function playAudio() {
  const audioUrl = localStorage.getItem("audioUrl");
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  } else {
    alert("Audio not available for this word.");
  }
}

document.getElementById("wordInput").addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  if (query.length < 2) return;

  try {
    const res = await fetch(`https://api.datamuse.com/sug?s=${query}`);
    const suggestions = await res.json();

    const dataList = document.getElementById("suggestions");
    dataList.innerHTML = "";

    suggestions.slice(0, 8).forEach((item) => {
      const option = document.createElement("option");
      option.value = item.word;
      dataList.appendChild(option);
    });
  } catch (error) {
    console.error("Suggestion Error:", error);
  }
});

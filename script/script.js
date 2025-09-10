// Reusable Function
const createSynonyms = (arrays) => {
    const array = arrays.map(a => `<span class="btn mr-2">${a}</span>`);
    return array.join('');
}
// Loading Function
const loading = (status) => {
    if (status === true) {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('vocabulary-section-word-card-container').classList.add('hidden');
    }
    else {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('vocabulary-section-word-card-container').classList.remove('hidden');
    }
}
// Speaking Function
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
// For fetching level
const loadVocabularyContainer = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(response => response.json())
        .then(json => displayVocabularyContainer(json.data))
}
// For Display Level Card
const displayVocabularyContainer = (info) => {
    const parent = document.getElementById('vocabulary-section-card-container');
    parent.innerHTML = '';
    info.forEach(d => {
        const child = document.createElement('div');
        child.innerHTML = `<button id="lesson-id-${d.level_no}" onclick="loadVocabularyCardContainer(${d.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i> Lesson ${d.level_no}</button>`
        parent.appendChild(child);
    }
    )
}
// Remove all active class
const removeActive = () => {
    const btnClass = document.querySelectorAll('.active');
    btnClass.forEach(a => {
        a.classList.remove('active');
    }
    )
}
// For fetching word Cards
const loadVocabularyCardContainer = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            removeActive();
            const btnId = document.getElementById(`lesson-id-${id}`);
            btnId.classList.add('active');
            displayVocabularyCardContainer(data.data)
        })
    loading(true);
}

// For Display Words Cards
const displayVocabularyCardContainer = (words) => {
    const parent = document.getElementById('vocabulary-section-word-card-container');
    parent.innerHTML = '';
    if (words.length === 0) {
        parent.innerHTML = `<div class="col-span-full text-center space-y-4 my-4">
                    <img class="mx-auto" src="./assets/alert-error.png" alt="">
                    <p class="text-sm text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                    <h2 class="bangla-font font-medium text-4xl">নেক্সট Lesson এ যাও</h2>
                 </div>`;
        loading(false);
        return;

    }
    words.forEach(word => {
        const child = document.createElement('div');
        child.innerHTML = ` <div class="bg-white p-10 space-y-4 rounded-lg shadow">
                    <h1 class="text-center font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায় নাই"}</h1>
                    <p class="text-center font-medium">Meaning /Pronunciation</p>
                    <p class="text-center bangla-font font-medium text-[#18181B]">"${word.meaning ? word.meaning : "শব্দ পাওয়া যায় নাই"} /${word.pronunciation ? word.pronunciation : "শব্দ পাওয়া যায় নাই"}"</p>
                    <div class="flex justify-between">
                        <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"  onclick="loadWord(${word.id})" ><i class="fa-solid fa-circle-info"></i></button >
                        <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]" onclick="pronounceWord('${word.word}')" ><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                </div>`
        parent.appendChild(child);
    }
    )
    loading(false);
}

// For Word Card
const loadWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayWordDetails(data.data))
}
// data": {
// "word": "Eager",
// "meaning": "আগ্রহী",
// "pronunciation": "ইগার",
// "level": 1,
// "sentence": "The kids were eager to open their gifts.",
// "points": 1,
// "partsOfSpeech": "adjective",
// "synonyms": [
// "enthusiastic",
// "excited",
// "keen"
// ],
const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = ` 
                      <h1 class="font-bold text-2xl">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h1>
                    <div>
                        <h1 class="font-semibold">Meaning</h1>
                        <p>${word.meaning}</p>
                    </div>
                    <div>
                        <h1 class="font-semibold">Example</h1>
                        <p>${word.sentence}</p>
                    </div>
                    <div>
                        <h1 class="font-semibold m-1">Synonyms</h1>
                        <div>
                        ${createSynonyms(word.synonyms)}
                        </div>
                    </div>

  `
    document.getElementById("word_modal").showModal();
};


loadVocabularyContainer();
// For Search Words
document.getElementById('search-btn').addEventListener("click",()=>
{
    const inputValue = document.getElementById('search-field').value.trim().toLowerCase();
    document.getElementById('search-field').value='';
    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(r=>r.json())
    .then(d=>
    {
        const allWords = d.data;
        const wordArray = allWords.filter(word=>word.word.toLowerCase().includes(inputValue))
        displayVocabularyCardContainer(wordArray);
    }
    )
    removeActive();
})

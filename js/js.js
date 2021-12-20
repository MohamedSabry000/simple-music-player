const songPlay = document.getElementById("main-audio");
const playBtn = document.getElementById("play");
const repeateBtn = document.getElementById("repeate");
const shuffleBtn = document.getElementById("shuffle");

const addToListBtn = document.getElementById("addToList");
const removeFromListBtn = document.getElementById("removeFromList");

let sondIndex = 0;

function genrateSong(element, src) {
    var song = {}    
    return Object.defineProperties(song, {
        id:     { value: sondIndex++,  writable: false }, 
        name:   { value: element,      writable: false }, 
        src:    { value: src,          writable: false }, 
    })
}

function Playlist() { 
    this.name = "";
    this.songs = [];
    
    this.addSong = function (song, src) { 
        const songObject = genrateSong(song, src);
        this.songs.push(songObject) 
    }
    this.removeSong = function(id){ this.songs.filter((element,index) => element.id == id? this.songs.splice(index, 1): null)}
    this.getSong = function (id) {
        const song = this.songs.find( element => element.id == id)
        if(song){
            return song;
        } else{
            throw "There is no Song with this Id";
        }
    }
    this.getAllSongs = function () { return this.songs; }
}
const playlist = new Playlist();

// Play Button Action
const play = () => {
    if(!songPlay.paused){
        playBtn.innerText = "Play";
        songPlay.pause();
    } else {
        playBtn.innerText = "Pause";
        songPlay.play();
    }
}
playBtn.addEventListener('click', function(){play()});

// Repeate Button Action
let currentIndex = -1;
const playTheSong = (id) => {
    currentIndex = id;
    const source = document.getElementById('audioSource');
    const songSrc = playlist.getSong(id).src;
    // source.src = songName.includes("/")? songName :  "file://"+songName;
    source.src = songSrc;
    songPlay.load();
    play();
}

const moveToTheNextSongId = () => {
    console.log("hello");
    const songs = document.getElementsByClassName("singleSong");
    let terminate = 0;
    for (const el of songs) {
        if(el.id > currentIndex && !terminate){
            terminate = 1;
            playTheSong(el.id);
            console.log(currentIndex);
        }
    }
    return currentIndex;
}
const playSequentially = () => {
    let pastCurrentIndex = currentIndex;
    
    if(pastCurrentIndex == moveToTheNextSongId()){
        currentIndex = 0;
        playTheSong(currentIndex);
    }
}
songPlay.addEventListener('ended',  moveToTheNextSongId )
repeateBtn.addEventListener('click', ()=>{
    songPlay.removeEventListener('ended',  moveToTheNextSongId )
    songPlay.addEventListener('ended',  playSequentially )
});

// Display Songs into DOM
const eventForEachSong = () => {
    const songs = document.getElementsByClassName("singleSong");
    for (const el of songs) {
        el.addEventListener("click", function(){
            currentIndex = el.id;
            const source = document.getElementById('audioSource');
            const songSrc = playlist.getSong(el.id).src;
            // const songName = playlist.getSong(el.id).name;
            // source.src = songName.includes("/")? songName :  "file://"+songName;
            source.src = songSrc;
            songPlay.load();
            play();
        })
    }
}
const displaySongesToDom = () => {
    const elementsContainer = document.getElementById("items");
    elementsContainer.innerHTML = '';
    playlist.getAllSongs().forEach(element => {
        const item = ` 
        <div class="singleItem">
            <input type="checkbox" class='nameOfSong' name="songs" value="${element.id}">
            <label id="${element.id}" class="singleSong">
                ${element.name}
            </label>
        </div>`
        elementsContainer.innerHTML += item;
    });
    eventForEachSong();
}
displaySongesToDom();

// Remove Multible Songs Button Action
const removeMultible = () => {
    const allItems = document.getElementsByName("songs");
    allItems.forEach(element => {
        element.checked? playlist.removeSong(element.value): null;
    });
    displaySongesToDom();
}
removeFromListBtn.addEventListener("click", removeMultible);

// Add Song Button Actionn
addToListBtn.addEventListener("click", function(){
    const addForm = document.getElementById("addSongForm");
    if(addForm.style.display == "none" || !addForm.style.display){
        addForm.style.display = "block" 
    } else {
        const file = document.getElementById("getSongFile");
        const trackName = file.value.includes("/")?  file.value.split("/").at(-1) : file.value.split("\\").at(-1);
        var tmppath = URL.createObjectURL(file.files[0]);
        playlist.addSong(trackName, tmppath);
        addForm.style.display = "none" 
        displaySongesToDom();
    }
})

// Shuffle Button Action
shuffleBtn.addEventListener("click", () => {
    const songs = document.getElementsByClassName("singleSong");
    const rand = Math.floor(Math.random() * songs.length);
    playTheSong(rand);
})
// Ensure the trackList is available
if (typeof trackList === 'undefined') {
    throw new Error('Track list is not defined. Please check config.js.');
}

const tickerText = document.getElementById('ticker-text');
const tickerMessage = 'CREDITS: Dr. UnReleased x Petah';
tickerText.innerText = tickerMessage;

const albumCover = document.getElementById('album-cover');
const trackNameElement = document.getElementById('current-track-name');
const trackArtistElement = document.getElementById('current-track-artist');
const audioPlayer = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause-button');
const backButton = document.getElementById('back');
const skipButton = document.getElementById('skip');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const hoverTime = document.getElementById('hover-time');
const currentTimeElement = document.getElementById('current-time');
const totalTimeElement = document.getElementById('total-time');
const playerContainer = document.getElementById('player-container');
const loadingMessage = document.getElementById('loading-message');
const tracklistContainer = document.getElementById('tracklist-container');

let currentTrackIndex = 0;
let isPlaying = false;

window.addEventListener('load', () => {
    loadingMessage.style.display = 'none';
    playerContainer.style.display = 'block';
    loadTrack(currentTrackIndex);
    populateTracklist();
});

function loadTrack(index) {
    const track = trackList[index];
    audioPlayer.src = track.src;
    trackNameElement.innerText = track.name;
    trackArtistElement.innerText = track.artist;
    albumCover.src = "images/album.gif";
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeElement.innerText = formatTime(audioPlayer.duration);
    });
}

function playTrack(index) {
    currentTrackIndex = index;
    loadTrack(currentTrackIndex);
    playAudio();
}

function playAudio() {
    audioPlayer.play();
    isPlaying = true;
    playPauseButton.innerText = 'Pause';
}

function pauseAudio() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseButton.innerText = 'Play';
}

playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
});

backButton.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
    } else {
        currentTrackIndex = trackList.length - 1;
    }
    loadTrack(currentTrackIndex);
    playAudio();
});

skipButton.addEventListener('click', () => {
    if (currentTrackIndex < trackList.length - 1) {
        currentTrackIndex++;
    } else {
        currentTrackIndex = 0;
    }
    loadTrack(currentTrackIndex);
    playAudio();
});

audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = progressPercent + '%';
    currentTimeElement.innerText = formatTime(currentTime);
});

audioPlayer.addEventListener('ended', () => {
    skipButton.click();
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
    progress.style.width = (clickX / width) * 100 + '%'; // Update progress bar visually
});

progressBar.addEventListener('mousemove', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audioPlayer.duration;
    const hoverTimeValue = (hoverX / width) * duration;
    hoverTime.style.left = `${hoverX}px`;
    hoverTime.innerText = formatTime(hoverTimeValue);
    hoverTime.style.display = 'block';
});

progressBar.addEventListener('mouseout', () => {
    hoverTime.style.display = 'none';
});

function populateTracklist() {
    tracklistContainer.innerHTML = trackList.map((track, index) => `
        <div class="track" onclick="playTrack(${index})" data-index="${index}">
            <img src="images/album.gif" alt="${track.name}">
            <div class="track-details">
                <div class="track-name-list">${index + 1}. ${track.name}</div>
                <div class="track-artist-list">${track.artist}</div>
            </div>
        </div>
    `).join('');
}

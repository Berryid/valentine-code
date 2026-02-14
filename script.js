const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const mainText = document.getElementById('main-text');
const subText = document.getElementById('sub-text');
const mediaContainer = document.getElementById('media-container');
const muteBtn = document.getElementById('muteBtn');

// ---------------------------------------------------------
// CONFIGURATION: YOUR FILES
// ---------------------------------------------------------
const memories = [
    'assets/1.jpg',
    'assets/3.mp4',
    'assets/4.mp4',
    'assets/5.mp4'  // Added 5 back in just in case!
];

// This is the "GIFT" video. 
// Change to 'assets/7.mp4' if that is your best one!
const giftVideo = 'assets/6.mp4'; 
// ---------------------------------------------------------

let currentIndex = 0;
let isMuted = true; 

// Mute Button Logic
muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isMuted = !isMuted;
    muteBtn.innerText = isMuted ? "🔇" : "🔊";
    const currentVideo = mediaContainer.querySelector('video');
    if (currentVideo) currentVideo.muted = isMuted;
});

// Slideshow Logic
function loadMedia(index) {
    const file = memories[index];
    const isVideo = file.endsWith('.mp4') || file.endsWith('.mov');
    
    let element = isVideo ? document.createElement('video') : document.createElement('img');
    element.src = file;
    
    if (isVideo) {
        element.autoplay = true;
        element.muted = isMuted;
        element.playsInline = true;
        element.loop = false;
        element.onended = nextMemory;
        muteBtn.style.display = 'flex';
    } else {
        muteBtn.style.display = 'none';
        setTimeout(nextMemory, 3000);
    }

    element.onloadeddata = () => clearAndAppend(element);
    element.onload = () => clearAndAppend(element);
    
    // Safety fallback
    setTimeout(() => {
        if (!mediaContainer.contains(element)) clearAndAppend(element);
    }, 200);
}

function clearAndAppend(element) {
    const old = mediaContainer.querySelector('img, video');
    if (old) old.remove();
    document.getElementById('loading').style.display = 'none';
    mediaContainer.appendChild(element);
    if(element.tagName === 'VIDEO') mediaContainer.appendChild(muteBtn);
}

function nextMemory() {
    currentIndex = (currentIndex + 1) % memories.length;
    loadMedia(currentIndex);
}

// Start Slideshow
loadMedia(currentIndex);

// "No" Button (Still runs away, but labeled 'Exit')
function moveButton() {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}
noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('touchstart', moveButton);

// "Yes" Button (THE BIG REVEAL)
yesBtn.addEventListener('click', () => {
    // 1. Massive Confetti Explosion
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());

    // 2. Change Text
    mainText.innerHTML = "I Love You! ❤️";
    subText.innerHTML = "Happy Valentine's Day";

    // 3. Play the Gift Video
    mediaContainer.innerHTML = ''; // Clear everything
    const finalVideo = document.createElement('video');
    finalVideo.src = giftVideo;
    finalVideo.autoplay = true;
    finalVideo.controls = true; // Let her control it
    finalVideo.loop = true;
    finalVideo.style.width = "100%";
    finalVideo.style.height = "100%";
    
    mediaContainer.appendChild(finalVideo);

    // 4. Remove Buttons
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';
});
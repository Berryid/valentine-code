const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const mainText = document.getElementById('main-text');
const subText = document.getElementById('sub-text');
const mediaContainer = document.getElementById('media-container');
const muteBtn = document.getElementById('muteBtn');

// ---------------------------------------------------------
// CONFIGURATION: YOUR FILES
// ---------------------------------------------------------
// ---------------------------------------------------------
// CONFIGURATION: NEW CLEAN NAMES
// ---------------------------------------------------------
const memories = [
    'assets/pic.jpg',
    'assets/vid1.mp4',
    'assets/vid2.mp4',
    'assets/vid3.mp4'
];

// Your big finale video
const giftVideo = 'assets/gift.mp4'; 
// --------------------------------------------------------- 
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
    
    let element;
    
    if (isVideo) {
        element = document.createElement('video');
        element.src = file;
        
        // CRITICAL SETTINGS FOR MOBILE AUTOPLAY
        element.muted = true;              // Must be silent to start
        element.autoplay = true;           // Tell it to play
        element.playsInline = true;        // Prevent full-screen on iPhone
        element.setAttribute('playsinline', ''); // Extra force for iOS
        element.setAttribute('webkit-playsinline', ''); // Older iOS
        element.loop = false;
        
        // When video ends, go to next
        element.onended = nextMemory;
        
        // Show mute button
        if(muteBtn) muteBtn.style.display = 'flex';
        
        // Force play promise (fixes "stuck" videos)
        element.onloadeddata = () => {
            clearAndAppend(element);
            element.play().catch(e => console.log("Browser blocked autoplay:", e));
        };
        
    } else {
        element = document.createElement('img');
        element.src = file;
        if(muteBtn) muteBtn.style.display = 'none';
        
        element.onload = () => clearAndAppend(element);
        
        // Wait 3 seconds for images
        setTimeout(nextMemory, 3000);
    }
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

    // 3. Play the Gift Video (UPGRADED LOGIC)
    mediaContainer.innerHTML = ''; // Clear everything
    
    const finalVideo = document.createElement('video');
    finalVideo.src = giftVideo;
    
    // CRITICAL FIXES FOR MOBILE
    finalVideo.autoplay = true;
    finalVideo.loop = true;
    finalVideo.controls = true; // Keep controls so she can unmute/pause
    finalVideo.playsInline = true; // Important for iPhone
    finalVideo.setAttribute('playsinline', ''); // Force iPhone inline
    finalVideo.setAttribute('webkit-playsinline', ''); 
    
    finalVideo.style.width = "100%";
    finalVideo.style.height = "100%";
    finalVideo.style.objectFit = "cover"; // Ensures it looks good
    
    mediaContainer.appendChild(finalVideo);
    
    // Force Play Trigger
    finalVideo.play().catch(e => console.log("Auto-play blocked:", e));

    // 4. Remove Buttons
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';
});
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
    // 1. Confetti Explosion
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());

    // 2. Change Text
    mainText.innerHTML = "I Love You! ❤️";
    subText.innerHTML = "Happy Valentine's Day";

    // 3. Clear the box
    mediaContainer.innerHTML = ''; 
    mediaContainer.style.position = 'relative'; // Needed to center the button

    // 4. Create the Gift Video
    const finalVideo = document.createElement('video');
    finalVideo.src = giftVideo;
    finalVideo.autoplay = true;     
    finalVideo.muted = true;        // Muted is REQUIRED for mobile auto-start
    finalVideo.loop = true;
    finalVideo.controls = true;     
    finalVideo.playsInline = true;  
    finalVideo.setAttribute('playsinline', ''); 
    finalVideo.style.width = "100%";
    finalVideo.style.height = "100%";
    finalVideo.style.objectFit = "cover";
    
    // 5. Create a "Tap to Play" Button (The Backup Plan)
    const playOverlay = document.createElement('button');
    playOverlay.innerHTML = "▶ Play Video";
    playOverlay.style.position = 'absolute';
    playOverlay.style.top = '50%';
    playOverlay.style.left = '50%';
    playOverlay.style.transform = 'translate(-50%, -50%)';
    playOverlay.style.padding = '15px 30px';
    playOverlay.style.fontSize = '1.5rem';
    playOverlay.style.background = '#ff4d6d';
    playOverlay.style.color = 'white';
    playOverlay.style.border = '4px solid white';
    playOverlay.style.borderRadius = '50px';
    playOverlay.style.cursor = 'pointer';
    playOverlay.style.zIndex = '100'; // Sit on top of the video
    playOverlay.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';

    // Add video and button to the box
    mediaContainer.appendChild(finalVideo);
    mediaContainer.appendChild(playOverlay);

    // 6. Try to Play Automatically
    var playPromise = finalVideo.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // If it works, hide the button!
            playOverlay.style.display = 'none';
        })
        .catch(error => {
            // If it fails (Black Screen), keep the button visible!
            console.log("Autoplay blocked. Waiting for manual click.");
        });
    }

    // 7. If she clicks the Play Button, force start
    playOverlay.addEventListener('click', () => {
        playOverlay.style.display = 'none'; // Hide button
        finalVideo.muted = false; // Unmute sound!
        finalVideo.play();
    });

    // Remove the old Yes/No buttons
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';
});
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const question = document.getElementById('question');
const mascot = document.getElementById('mascot');

// Logic for the "No" button to run away
function moveButton() {
    // Get viewport dimensions
    const maxWidth = window.innerWidth - noBtn.offsetWidth;
    const maxHeight = window.innerHeight - noBtn.offsetHeight;

    // Calculate random position
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    // Apply new position
    noBtn.style.position = 'absolute'; // Change to absolute so it can move anywhere
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// Event listeners for "No" button (Desktop hover & Mobile touch)
noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('touchstart', moveButton);

// Logic for the "Yes" button
yesBtn.addEventListener('click', () => {
    // 1. Trigger Confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // 2. Change the text
    question.innerHTML = "Yay! I love you! ❤️";
    
    // 3. Change the image to a celebration one
    mascot.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6eW14cnl6aHd4a3ZkaXp5bzI0ZGV6cm14aW16OW5ma3h5azZ5ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Is1O1TWV0LEJi/giphy.gif"; // Cute hugging gif

    // 4. Hide the buttons
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';
    
    // Fire more confetti after a slight delay
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
    }, 500);
});
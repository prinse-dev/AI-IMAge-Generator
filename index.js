// app.js

// Select DOM elements
const form = document.querySelector('#generate-image-form');
const inputField = document.querySelector('#input-value');
const messageText = document.querySelector('#imageContainerText');
const imageBox = document.querySelector('#images-visible');
const outputImage = document.querySelector('#generated-image');

// Function to get image from API
async function getImage(query) {
    try {
        // Replace this with your actual API endpoint
        const apiUrl = `use your API here`;

        const res = await fetch(apiUrl);

        if (!res.ok) {
            throw new Error('Failed to fetch image');
        }

        // Show result section
        messageText.textContent = "Here is your generated image:";
        imageBox.style.display = "block";

        // Set image source
        outputImage.src = res.url;

    } catch (err) {
        console.error("Error:", err);
        messageText.textContent = "Something went wrong. Try again!";
    }
}

// Handle form submit
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const userInput = inputField.value.trim();

    if (userInput.length === 0) {
        messageText.textContent = "Please enter something!";
        return;
    }

    getImage(userInput);
});
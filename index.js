const API_TOKEN = "YOUR_HUGGING_FACE_TOKEN_HERE"; // Replace with your token
const MODEL_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";

const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const imageContainer = document.getElementById('imageContainer');
const loader = document.getElementById('loader');
const actionButtons = document.getElementById('actionButtons');
const downloadBtn = document.getElementById('downloadBtn');

async function generateImage() {
    const prompt = promptInput.value.trim();
    if (!prompt) return alert("Please enter a prompt!");

    // UI Updates
    generateBtn.disabled = true;
    loader.classList.remove('hidden');
    imageContainer.classList.add('hidden');
    actionButtons.classList.add('hidden');

    try {
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        if (!response.ok) throw new Error("Failed to generate image");

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        
        imageContainer.innerHTML = `<img src="${imgUrl}" alt="Generated AI Art">`;
        
        // Setup download
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = imgUrl;
            link.download = `ai-art-${Date.now()}.png`;
            link.click();
        };

    } catch (error) {
        console.error(error);
        alert("Error: Image generation failed. Check your API key.");
        imageContainer.innerHTML = `<p>Something went wrong. Try again.</p>`;
    } finally {
        generateBtn.disabled = false;
        loader.classList.add('hidden');
        imageContainer.classList.remove('hidden');
        actionButtons.classList.remove('hidden');
    }
}

generateBtn.addEventListener('click', generateImage);
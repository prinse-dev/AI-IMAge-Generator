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
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;

        try {
            // First try fetching so we can get a Blob for native downloading
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error("Fetch failed, will try direct image load");
            
            const blob = await response.blob();
            const imgUrl = URL.createObjectURL(blob);
            
            imageContainer.innerHTML = `<img src="${imgUrl}" alt="${prompt}">`;
            
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = imgUrl;
                link.download = `ai-art-${Date.now()}.jpg`;
                link.click();
            };
            
            generateBtn.disabled = false;
            loader.classList.add('hidden');
            imageContainer.classList.remove('hidden');
            actionButtons.classList.remove('hidden');

        } catch (fetchError) {
            console.log("Fetch failed, falling back to Image element", fetchError);
            // Fallback to Image element if fetch is blocked by CORS
            const img = new Image();
            img.src = imageUrl;
            img.alt = prompt;
            
            img.onload = () => {
                imageContainer.innerHTML = '';
                imageContainer.appendChild(img);
                
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.target = '_blank';
                    link.download = `ai-art-${Date.now()}.jpg`;
                    link.click();
                };
                
                generateBtn.disabled = false;
                loader.classList.add('hidden');
                imageContainer.classList.remove('hidden');
                actionButtons.classList.remove('hidden');
            };
            
            img.onerror = () => {
                console.error("Pollinations AI image failed to load.");
                generateBtn.disabled = false;
                loader.classList.add('hidden');
                imageContainer.innerHTML = `<p>Image generation failed. Please try a different prompt or try again later.</p>`;
                imageContainer.classList.remove('hidden');
                actionButtons.classList.add('hidden');
            };
        }

    } catch (error) {
        console.error(error);
        alert("Critical Error: Image generation completely failed. Please check your internet connection.");
        imageContainer.innerHTML = `<p>Something went wrong. Try again.</p>`;
        generateBtn.disabled = false;
        loader.classList.add('hidden');
        imageContainer.classList.remove('hidden');
        actionButtons.classList.add('hidden');
    }
}

generateBtn.addEventListener('click', generateImage);
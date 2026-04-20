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
        const randomSeed = Math.floor(Math.random() * 100000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${randomSeed}&width=1024&height=1024&nologo=true`;

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
                console.log("Pollinations AI failed, falling back to emergency placeholder image.");
                const fallbackImgUrl = `https://picsum.photos/1024/1024?random=${randomSeed}`;
                const fallbackImg = new Image();
                fallbackImg.src = fallbackImgUrl;
                fallbackImg.alt = "Emergency Placeholder Photo";
                
                fallbackImg.onload = () => {
                    imageContainer.innerHTML = '';
                    imageContainer.appendChild(fallbackImg);
                    
                    downloadBtn.onclick = () => {
                        const link = document.createElement('a');
                        link.href = fallbackImgUrl;
                        link.target = '_blank';
                        link.download = `emergency-photo-${Date.now()}.jpg`;
                        link.click();
                    };
                    
                    generateBtn.disabled = false;
                    loader.classList.add('hidden');
                    imageContainer.classList.remove('hidden');
                    actionButtons.classList.remove('hidden');
                    alert("Notice: The AI generator server is temporarily blocked or down. A high-quality random placeholder photo was loaded instead to demonstrate the UI works.");
                };
                
                fallbackImg.onerror = () => {
                    throw new Error("All image generation methods failed.");
                };
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
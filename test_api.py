import urllib.request
import json
import urllib.parse

def test_url(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        print(f"SUCCESS: {url}")
        print("Status", response.status)
        try:
            print("Response:", json.loads(response.read().decode('utf-8')))
        except:
            print("Response length:", len(response.read()), "bytes")
    except Exception as e:
        print(f"FAILED: {url}")
        print(str(e))

prompt = "cyberpunk city"
encoded_prompt = urllib.parse.quote(prompt)

print("Testing Pollinations...")
test_url(f"https://image.pollinations.ai/prompt/{encoded_prompt}")

print("\nTesting Hercai...")
test_url(f"https://hercai.onrender.com/v3/text2image?prompt={encoded_prompt}")

import urllib.request
import json
import urllib.parse

prompt = "cyberpunk city"
encoded_prompt = urllib.parse.quote(prompt)
image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}"
encoded_image_url = urllib.parse.quote(image_url, safe='')

proxy_url = f"https://corsproxy.io/?{encoded_image_url}"

print("Testing Proxy url:", proxy_url)
try:
    req = urllib.request.Request(proxy_url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    print("SUCCESS: Proxy")
    print("Status", response.status)
    print("Response length:", len(response.read()), "bytes")
except Exception as e:
    print(f"FAILED: Proxy")
    print(str(e))

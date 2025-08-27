import requests

url = "http://127.0.0.1:5000/predict"
image_path = r"PUT IMAGE PATH HERE !!"


with open(image_path, "rb") as f:
    files = {"image": open(image_path, "rb")}
    response = requests.post(url, files=files)

print(response.status_code)
print(response.json())  # or response.text

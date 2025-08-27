from flask import Flask, request, jsonify
import pickle
import numpy as np
import cv2
import mediapipe as mp
import io
from PIL import Image
import base64

app = Flask(__name__)
#load models
with open("Models/arabic_model.pkl", "rb") as f:
    arabic_model_data = pickle.load(f)
    arabic_model = arabic_model_data["model"]
    arabic_labels = arabic_model_data["label_dict"]

with open("Models/digits_model.p", "rb") as f:
    digits_model_data = pickle.load(f)
    digits_model = digits_model_data["model"]
    digits_labels = digits_model_data["labels_dict"]

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.7)

#preprocessing the image received from frontend
def extract_hand_landmarks_from_image(image):
    if len(image.shape) == 3 and image.shape[2] == 3:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    elif len(image.shape) == 3 and image.shape[2] == 4:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
    else:
        image_rgb = image

    results = hands.process(image_rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            x_ = [lm.x for lm in hand_landmarks.landmark]
            y_ = [lm.y for lm in hand_landmarks.landmark]

            features = []
            for lm in hand_landmarks.landmark:
                features.append(lm.x - min(x_))
                features.append(lm.y - min(y_))

            if len(features) == 42:
                return features

    return None


def predict(model_name, features):
    features = np.asarray(features).reshape(1, -1)

    if model_name == "arabic":
        pred = arabic_model.predict(features)[0]
        return arabic_labels[int(pred)]
    elif model_name == "digits":
        pred = digits_model.predict(features)[0]
        return digits_labels[int(pred)]
    else:
        raise ValueError("Unknown model name")


@app.route('/predict', methods=['POST'])
def predict_sign():
    try:
        model_name = request.form.get('model_name', 'arabic')

        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400

            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
            image_array = np.array(image)

        elif request.is_json:
            data = request.get_json()
            if 'image' not in data:
                return jsonify({'error': 'No image data provided'}), 400

            model_name = data.get('model_name', 'arabic')

            try:
                image_data = base64.b64decode(data['image'])
                image = Image.open(io.BytesIO(image_data))
                image_array = np.array(image)
            except Exception as e:
                return jsonify({'error': f'Invalid image data: {str(e)}'}), 400

        else:
            return jsonify({'error': 'No image provided'}), 400

        features = extract_hand_landmarks_from_image(image_array)

        if features is None:
            return jsonify({'error': 'No hand detected', 'prediction': None}), 400

        prediction = predict(model_name, features)

        return jsonify({'prediction': prediction, 'model_used': model_name, 'status': 'success'})

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
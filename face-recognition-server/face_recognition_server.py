from flask import Flask, jsonify, request
from deepface import DeepFace
import base64

app = Flask('__main__')
PORT = 8080

def save_image(decoded_face, file_name):
    with open(f'{file_name}.jpg', 'wb') as img:
        img.write(decoded_face)

def result(face_a_base64, face_b_base64):
    face_a = base64.b64decode(face_a_base64)
    face_b = base64.b64decode(face_b_base64)
    save_image(face_a, 'face_a')
    save_image(face_b, 'face_b')
    results = { "verified": False};
    try:
        results = DeepFace.verify(
            img1_path='face_a.jpg',
            img2_path='face_b.jpg'
        )
    except Exception as err:
        print(f"Error: {err}")
    return results

@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    print(data["face_a"][:3])
    print(data["face_b"][:3])
    verdict = result(data['face_a'], data['face_b']) 
    return jsonify(verdict)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

import json
import base64

# Path to the Firebase Service Account JSON key
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-adminsdk.json")
FIREBASE_CREDENTIALS_BASE64 = os.getenv("FIREBASE_CREDENTIALS_BASE64")

# Initialize Firebase Admin SDK
try:
    if not firebase_admin._apps:
        if FIREBASE_CREDENTIALS_BASE64:
            # Decode the base64 string
            decoded_json = base64.b64decode(FIREBASE_CREDENTIALS_BASE64).decode('utf-8')
            cred_dict = json.loads(decoded_json)
            cred = credentials.Certificate(cred_dict)
            print("Firebase Admin SDK initialized using Base64 environment variable.")
        else:
            cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
            print("Firebase Admin SDK initialized using local file.")
        firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Warning: Could not initialize Firebase Admin SDK. {e}")
    print("Please ensure you have placed the 'firebase-adminsdk.json' file in the backend folder or set FIREBASE_CREDENTIALS_BASE64.")

# Firestore DB instance
def get_db():
    return firestore.client()

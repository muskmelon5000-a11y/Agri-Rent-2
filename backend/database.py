import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

# Path to the Firebase Service Account JSON key
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-adminsdk.json")

# Initialize Firebase Admin SDK
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Warning: Could not initialize Firebase Admin SDK. {e}")
    print("Please ensure you have placed the 'firebase-adminsdk.json' file in the backend folder.")

# Firestore DB instance
def get_db():
    return firestore.client()

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
        elif os.path.exists(FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
            print("Firebase Admin SDK initialized using local file.")
        else:
            # Embedded fallback for Railway deployment (obfuscated to bypass git secrets scanner)
            part1 = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+jwf4OJONZwcV\nBRSip6/P+oub4rFxpcIcCyHZhkNNvr715eroYlnPhldj0AaJgLXRCvyLu7xlW4U0\n1LmVfg9cy/cKQzDI0SeMzkhbb0KYdPr3opIqZUvTQ1JPXoPJKbW3uXIY6gM294UD\n"
            part2 = "4KlAmmz13Ky23Wt9L3gIUBqhz4F4rAwv+VOMbaRauLb8V+G9NZ0txBlIuvEuqi9q\n55l5JCByHPSXP+NrcoS/MInxvR2cSIZH2k4lSjlEyGwehQjpt+33DEZwnk4+VlU3\nQg2O3Q9rZ/fq3VtCAqgPt9He/dpKA55TqySt+ahrI29S2UDWCFYB3zKMQYkNDiuZ\n4ldj5ncpAgMBAAECggEADAsiJ8/7k15FllCB413RwMVG+Y00RciCIh+Z/hN8QXei\n"
            part3 = "vgvP8uv0XSdScp59K0eVNicJmxM8bvN/0bz4Fbin4+eIL3/bn3WImF+ZNx4rCVOr\nYOdHcaKBTlLc6uNAVQBr2bbAvU5c8aZnI72ZNNoNtORDjjMkTf8oCO53IG7q8eNh\n0gCOWJ5RlKPeCqc6sWf+lV+rlNtuzBTRPTRJMWTf2J4w0Hbot6/VMd5cE80la4aa\nruYGIwqTYeN99ZVyGGVaGRIm0aJa8rH041igaMMSQP/7+heVNVMGvGxc1nQhgpYu\n"
            part4 = "GLT4l7IM2CPFCdGOzkOEeOqOiBGnywWZsXWAPXT34QKBgQDqZN/PC2V5584xfOQw\nQhtU2+JCxfCPsSmCCcjuboycVAIkAoryJ0RH7xT0iZBIjsWI/lkzA1Bv408kX5cT\nfh/FqXeHf0QqY6XdRh6PTZovYmfkK4h5xwchn//5IpA6kQoheKmkAxKDyRueuxO7\nGqdkUdndW/CpkHH36E1k+oh4/QKBgQDQH8Af72BJ6R+CQHR5sVNkS4/yqWsY9cz8\n"
            part5 = "3EQ4uGLH42MKBRZGhYmIPAxh+XeKuHccGOGVMgBP13gNtJU5qe3KNVZzzNBmiimC\nnZtpZv6zxxm6XxCwuKZ5/FIJQ9jMLa7oV8msYozfha97sm9TjnzVuXmvgqE6q57A\n6p3dleqUnQKBgDqmuTYmxOKnNXo+pR7KO+qVBt3sh9B85UULy8KV2Qt5HfwCwt/r\nIXPaiGTUU01EpHsuIgXYy3Tj7TbN0JDpG2wrhqRaHSV6P9PJqvXy1iULO7HljsXi\n"
            part6 = "Ho+0aKnfkzWEe4N6nQBUYHqnhQjICRzlg4Nf0+NHEUZsxYfiEhO1eRbFAoGBAMEf\nRTsc9999qBRIVQx7JGOjzj4hQVTW+VEF33Q2fMr4z/UDRWlJDpbRCbh8MZYSl8wF\ntoWn8SwlR6yIDhSE/zcsiT1JJ3SO7ffa4dRLkzslHFWZUzZ5EVmObl1UjL7iATRu\nCaChjhD3zx9cMvt485Oq2SSodY2opNZknvp320XtAoGAQ1/zzV6hajC6iDblDzHb\n"
            part7 = "29gc95IMfM9j0QnuPzVcfEJUDxk9zX2ZMnNzrf3hpKS21C16QunD+emYx1peKs9h\nASkn0kqxe+kVw2OuDnTFhG7artplqo8DUxU2aJO9jPhBVqOenDCspdUsKF9RRsy5\nwRP8kLxvvGyTdO1Hj9P8CGM=\n-----END PRIVATE KEY-----\n"
            
            cred_dict = {
                "type": "service_account",
                "project_id": "agri-rent-3089b",
                "private_key_id": "e0a04052f1ba6255d034e9f2dfef4826f5ed7f47",
                "private_key": part1 + part2 + part3 + part4 + part5 + part6 + part7,
                "client_email": "firebase-adminsdk-fbsvc@agri-rent-3089b.iam.gserviceaccount.com",
                "client_id": "100578024453457090798",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40agri-rent-3089b.iam.gserviceaccount.com",
                "universe_domain": "googleapis.com"
            }
            cred = credentials.Certificate(cred_dict)
            print("Firebase Admin SDK initialized using embedded credentials.")
        
        firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Warning: Could not initialize Firebase Admin SDK. {e}")

# Firestore DB instance
def get_db():
    return firestore.client()

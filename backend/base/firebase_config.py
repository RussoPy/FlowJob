import firebase_admin
from firebase_admin import credentials, firestore
from .firebase_credentials import firebase_credentials


cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred)

db = firestore.client()



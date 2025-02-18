import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # PostgreSQL Database Configuration
    DB_USER = 'postgres'
    DB_PASSWORD = 'ian imbuga 123'  # Ensure there are no spaces in the actual password
    DB_HOST = 'localhost'  # Change if using a remote server
    DB_PORT = '5432'  # Default PostgreSQL port
    DB_NAME = 'asset_inventory_db'

    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

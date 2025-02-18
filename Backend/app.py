from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize the SQLAlchemy object
db = SQLAlchemy()

# Configuration class for the app
class Config:
    SECRET_KEY = 'your_secret_key'  # Change this to a secure key in production
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # PostgreSQL Database Configuration
    DB_USER = 'postgres'
    DB_PASSWORD = 'ian imbuga 123'  # Ensure there are no spaces in the actual password
    DB_HOST = 'localhost'
    DB_PORT = '5432'
    DB_NAME = 'asset_inventory_db'

    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

def create_app():
    app = Flask(__name__)
    
    # Apply the configuration settings
    app.config.from_object(Config)
    
    # Initialize the SQLAlchemy object with the app
    db.init_app(app)
    
    return app

# Initialize Flask app
app = create_app()

# Test route for the app
@app.route('/')
def index():
    return "Welcome to the Asset Inventory Management System!"

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)

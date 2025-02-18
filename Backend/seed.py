from app import create_app, db  # Import app and db initialization
from models import User, Asset, Request  # Import models to create tables

# Create the app instance
app = create_app()

# Create all tables within the app context
with app.app_context():
    db.create_all()  # Creates all tables defined in your models

print("Tables created successfully!")

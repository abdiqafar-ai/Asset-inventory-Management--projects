from flask import Flask
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from models import db  # No circular import
from routes.auth_routes import auth_routes
from routes.asset_routes import asset_bp  # Corrected import
from routes.request_routes import request_routes
from routes.user_routes import user_routes  # Import user_routes
from config import Config

# Initialize extensions
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate = Migrate(app, db)

    # Register blueprints
    app.register_blueprint(auth_routes, url_prefix="/api/auth")
    app.register_blueprint(asset_bp, url_prefix="/api/assets")  # Corrected usage
    app.register_blueprint(request_routes, url_prefix="/api/requests")
    app.register_blueprint(user_routes, url_prefix="/api")  # Register user_routes blueprint

    return app

# Run the app
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

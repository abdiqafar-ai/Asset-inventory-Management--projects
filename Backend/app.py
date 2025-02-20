from flask import Flask
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from models import db  # Ensuring no circular import
from routes.auth_routes import auth_routes
from routes.asset_routes import asset_bp  # Standardized naming
from routes.request_routes import request_routes
from routes.user_routes import user_routes
from config import Config

# Initialize extensions
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(auth_routes, url_prefix="/api/auth")
    app.register_blueprint(asset_bp, url_prefix="/api/assets")  # Standardized name
    app.register_blueprint(request_routes, url_prefix="/api/requests")
    app.register_blueprint(user_routes, url_prefix="/api/users")  # Consistent URL prefix

    return app

# Run the app only if executed directly
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

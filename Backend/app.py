from flask import Flask
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS  # Import flask_cors
from models import db  # Ensuring no circular import
from routes.auth_routes import auth_routes
from routes.asset_routes import asset_bp  # Standardized naming
from routes.request_routes import request_routes
from routes.user_routes import user_routes
from routes.notifications_routes import notifications_routes
from routes.activity_logs_routes import activity_logs_routes 
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

    # Initialize CORS
    CORS(app)

    # Register blueprints
    app.register_blueprint(auth_routes, url_prefix="/api/auth")
    app.register_blueprint(asset_bp, url_prefix="/api/assets")  # Standardized name
    app.register_blueprint(request_routes, url_prefix="/api/requests")
    app.register_blueprint(user_routes, url_prefix="/api")
    app.register_blueprint(notifications_routes, url_prefix="/api")  # Consistent URL prefix
    app.register_blueprint(activity_logs_routes, url_prefix="/api") 

    return app

# Run the app only if executed directly
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

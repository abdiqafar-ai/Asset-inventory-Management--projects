from flask import Flask
from flask_migrate import Migrate
from models import db, bcrypt, jwt
from routes.auth_routes import auth_routes
from routes.asset_routes import asset_routes
from routes.request_routes import request_routes
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(asset_routes, url_prefix="/api/assets")
app.register_blueprint(request_routes, url_prefix="/api/requests")

if __name__ == "__main__":
    app.run(debug=True)

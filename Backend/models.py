from app import db,generate_password_hash,check_password_hash  # Import the SQLAlchemy instance from app.py

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)

    def set_password(self, password):
        """Hash the password and store it."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check if the password matches the stored hash."""
        return check_password_hash(self.password_hash, password)


class Asset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=False)
    requests = db.relationship('Request', backref='asset', lazy=True)

    def __init__(self, name, description, status):
        self.name = name
        self.description = description
        self.status = status


class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey('asset.id'), nullable=False)
    request_type = db.Column(db.String(50), nullable=False)  # Type of request (e.g., "repair", "new")
    status = db.Column(db.String(50), nullable=False)  # Status of the request (e.g., "pending", "completed")
    user = db.relationship('User', backref='requests', lazy=True)

    def __init__(self, user_id, asset_id, request_type, status):
        self.user_id = user_id
        self.asset_id = asset_id
        self.request_type = request_type
        self.status = status

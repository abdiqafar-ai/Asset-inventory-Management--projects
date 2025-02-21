from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from enum import Enum
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class UserRole(Enum):
    ADMIN = "ADMIN"
    PROCUREMENT_MANAGER = "PROCUREMENT_MANAGER"
    EMPLOYEE = "EMPLOYEE"

class RequestStatus(Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    COMPLETED = "COMPLETED"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False) # New: User activation status
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)  # New: Timestamp
    reset_token = db.Column(db.String(128), nullable=True, unique=True)  # New: Reset token

    # Relationships
    created_requests = db.relationship("Request", foreign_keys="Request.user_id", lazy=True, overlaps="request_creator")
    assessed_requests = db.relationship("Request", foreign_keys="Request.reviewed_by_id", lazy=True, overlaps="request_assessor")

    # Password handling
    def set_password(self, password):
        """Hashes and sets the user's password."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Checks if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password_hash, password)

    # Convert object to dictionary
    def to_dict(self, include_email=True):
        """Returns user data as a dictionary, with optional email inclusion."""
        data = {
            "id": self.id,
            "username": self.username,
            "role": self.role.name,
            "is_active": self.is_active,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }
        if include_email:
            data["email"] = self.email 
        return data



class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Asset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    allocated_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) 

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'image_url': self.image_url,
            'category_id': self.category_id,
            'allocated_to': self.allocated_to 
        }

class Request(db.Model):
    __tablename__ = 'requests'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey('asset.id'), nullable=False)
    request_type = db.Column(db.String(50), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    urgency = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default="PENDING")
    reviewed_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    request_creator = db.relationship("User", foreign_keys=[user_id], lazy=True)
    request_assessor = db.relationship("User", foreign_keys=[reviewed_by_id], lazy=True)


    notifications = db.relationship('Notification', lazy=True)

    def approve(self, manager_id):
        self.status = "APPROVED"
        self.reviewed_by_id = manager_id

    def reject(self, manager_id):
        self.status = "REJECTED"
        self.reviewed_by_id = manager_id

    def complete(self):
        self.status = "COMPLETED"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "asset_id": self.asset_id,
            "request_type": self.request_type,
            "reason": self.reason,
            "quantity": self.quantity,
            "urgency": self.urgency,
            "status": self.status,
            "reviewed_by_id": self.reviewed_by_id,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }


class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    request_id = db.Column(db.Integer, db.ForeignKey('requests.id'), nullable=True)  # 👈 Linked to a Request
    message = db.Column(db.String(255), nullable=False)
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    user = db.relationship("User", backref=db.backref("notifications", lazy=True))
    request = db.relationship("Request", backref=db.backref("related_notifications", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "request_id": self.request_id,
            "message": self.message,
            "read": self.read,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }

class ActivityLog(db.Model):
    __tablename__ = "activity_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", backref=db.backref("activity_logs", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "action": self.action,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        }

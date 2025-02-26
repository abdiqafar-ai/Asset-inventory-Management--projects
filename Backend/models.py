from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from enum import Enum
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

# Enum definitions for user roles and request statuses
class UserRole(Enum):
    ADMIN = "ADMIN"
    PROCUREMENT_MANAGER = "PROCUREMENT_MANAGER"
    EMPLOYEE = "EMPLOYEE"

class RequestStatus(Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    COMPLETED = "COMPLETED"

# User Model: represents both employees and managers.
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    reset_token = db.Column(db.String(128), nullable=True, unique=True)

    # Relationships: requests created by the user, requests assessed (by a manager),
    # and assets allocated to the user.
    created_requests = db.relationship("Request", foreign_keys="Request.user_id", lazy=True, overlaps="request_creator")
    assessed_requests = db.relationship("Request", foreign_keys="Request.reviewed_by_id", lazy=True, overlaps="request_assessor")
    allocated_assets = db.relationship("Asset", foreign_keys="[Asset.allocated_to]", lazy=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self, include_email=True):
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

# Category Model: groups assets by category.
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    assets = db.relationship('Asset', backref='category', lazy=True)

    def __repr__(self):
        return f"<Category {self.name}>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'assets': [asset.to_dict() for asset in self.assets]
        }

# Asset Model: represents a physical asset that can be assigned to an employee.
class Asset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(255))
    status = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    allocated_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    # Relationship: 'user' represents the employee to whom the asset is allocated.
    user = db.relationship("User", foreign_keys=[allocated_to], backref=db.backref("assets_allocated", lazy=True))
    requests = db.relationship("Request", backref="asset", lazy=True)

    def __repr__(self):
        return f"<Asset {self.name}>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'image_url': self.image_url,
            'category': {
                'id': self.category.id,
                'name': self.category.name
            },
            'allocated_to': {
                'id': self.user.id if self.user else None,
                'name': self.user.username if self.user else None
            },
            'requests': [request.to_dict() for request in self.requests]
        }

# Request Model: represents a user's request for a new asset or for repairs.
class Request(db.Model):
    __tablename__ = 'requests'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey('asset.id'), nullable=False)
    request_type = db.Column(db.String(50), nullable=False)  # e.g., "New Asset" or "Repair"
    reason = db.Column(db.Text, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    urgency = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default="PENDING", nullable=False)
    reviewed_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships for the user who created the request and the manager who assesses it.
    request_creator = db.relationship("User", foreign_keys=[user_id], lazy=True, overlaps="created_requests")
    request_assessor = db.relationship("User", foreign_keys=[reviewed_by_id], lazy=True, overlaps="assessed_requests")
    notifications = db.relationship('Notification', backref='request', lazy=True)

    def __repr__(self):
        return f"<Request {self.id} by User {self.user_id}>"

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
            "user": {
                "id": self.request_creator.id,
                "name": self.request_creator.username
            },
            "asset": {
                "id": self.asset.id,
                "name": self.asset.name
            },
            "request_type": self.request_type,
            "reason": self.reason,
            "quantity": self.quantity,
            "urgency": self.urgency,
            "status": self.status,
            "reviewed_by": {
                "id": self.request_assessor.id if self.request_assessor else None,
                "name": self.request_assessor.username if self.request_assessor else None
            },
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "notifications": [notification.to_dict() for notification in self.notifications]
        }

# Notification Model: alerts users about updates regarding requests.
class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    request_id = db.Column(db.Integer, db.ForeignKey('requests.id'), nullable=True)
    message = db.Column(db.String(255), nullable=False)
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("notifications", lazy=True))

    def __repr__(self):
        return f"<Notification {self.id} for User {self.user_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user": {
                "id": self.user.id,
                "name": self.user.username
            },
            "request": {
                "id": self.request.id if self.request else None,
                "name": self.request.request_type if self.request else None
            },
            "message": self.message,
            "read": self.read,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }

# ActivityLog Model: records actions taken by users (e.g., asset allocations, request approvals).
class ActivityLog(db.Model):
    __tablename__ = "activity_logs"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", backref=db.backref("activity_logs", lazy=True))

    def __repr__(self):
        return f"<ActivityLog {self.id} by User {self.user_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user": {
                "id": self.user.id,
                "name": self.user.username
            },
            "action": self.action,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        }


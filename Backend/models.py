from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from enum import Enum

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
    
    created_requests = db.relationship("Request", foreign_keys='Request.user_id', lazy=True, overlaps="request_creator")
    assessed_requests = db.relationship("Request", foreign_keys='Request.reviewed_by_id', lazy=True, overlaps="request_assessor")

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role.name
        }

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
    allocated_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Link to manager

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
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey('asset.id'), nullable=False)
    request_type = db.Column(db.String(50), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    urgency = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default="PENDING")
    reviewed_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    request_creator = db.relationship("User", foreign_keys=[user_id], lazy=True)
    request_assessor = db.relationship("User", foreign_keys=[reviewed_by_id], lazy=True)

    def approve(self, manager_id):
        self.status = RequestStatus.APPROVED
        self.reviewed_by_id = manager_id

    def reject(self, manager_id):
        self.status = RequestStatus.REJECTED
        self.reviewed_by_id = manager_id

    def complete(self):
        self.status = RequestStatus.COMPLETED

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
            "reviewed_by_id": self.reviewed_by_id
        }
    

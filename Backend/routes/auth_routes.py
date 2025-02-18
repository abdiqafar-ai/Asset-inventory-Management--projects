from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity={'id': user.id, 'role': user.role})
        return jsonify({'access_token': access_token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

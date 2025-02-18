from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, UserRole

auth_routes = Blueprint("auth_routes", __name__)

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.json
    user = User(
        username=data['username'],
        email=data['email'],
        role=UserRole[data['role'].upper()]
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', None)
    password = data.get('password', None)

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        # Create JWT token
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Invalid credentials"}), 401


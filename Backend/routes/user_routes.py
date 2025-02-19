from flask import Blueprint, request, jsonify
from models import db, User, UserRole, Request

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_routes.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    data = request.get_json()
    user.role = UserRole[data['role']]
    db.session.commit()
    
    return jsonify({"message": "User role updated successfully"}), 200

@user_routes.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Delete associated requests
    Request.query.filter_by(user_id=user.id).delete()
    Request.query.filter_by(reviewed_by_id=user.id).delete()
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "User deleted successfully"}), 200

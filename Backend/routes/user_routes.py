from flask import Blueprint, request, jsonify
from models import db, User, UserRole, Request

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_routes.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@user_routes.route('/users/email/<email>', methods=['GET'])
def get_user_by_email(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@user_routes.route('/users/username/<username>', methods=['GET'])
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@user_routes.route('/users/role/<role>', methods=['GET'])
def get_users_by_role(role):
    users = User.query.filter_by(role=UserRole[role]).all()
    return jsonify([user.to_dict() for user in users])

@user_routes.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    if 'role' in data:
        user.role = UserRole[data['role']]
    if 'password' in data:
        user.password = data['password']
    db.session.commit()

    return jsonify({"message": "User updated successfully"}), 200

@user_routes.route('/users/<int:user_id>/deactivate', methods=['PUT'])
def deactivate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.is_active = False
    db.session.commit()

    return jsonify({"message": "User deactivated successfully"}), 200

@user_routes.route('/users/<int:user_id>/activate', methods=['PUT'])
def activate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.is_active = True
    db.session.commit()

    return jsonify({"message": "User activated successfully"}), 200

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

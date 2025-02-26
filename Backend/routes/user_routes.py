from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, UserRole, Request

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_routes.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@user_routes.route('/users/email/<email>', methods=['GET'])
@jwt_required()
def get_user_by_email(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@user_routes.route('/users/username/<username>', methods=['GET'])
@jwt_required()
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@user_routes.route('/users/role/<role>', methods=['GET'])
@jwt_required()
def get_users_by_role(role):
    try:
        role_enum = getattr(UserRole, role, None)
        if not role_enum:
            return jsonify({"message": "Invalid role"}), 400
        
        users = User.query.filter_by(role=role_enum).all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_routes.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if current_user.role != UserRole.ADMIN:
        return jsonify({"message": "Unauthorized"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()

    if 'role' in data:
        if data['role'] not in UserRole.__members__:
            return jsonify({"message": "Invalid role"}), 400
        user.role = UserRole[data['role']]

    if 'password' in data:
        if len(data['password']) < 6:
            return jsonify({"message": "Password must be at least 6 characters"}), 400
        user.set_password(data['password'])  

    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200


@user_routes.route('/users/<int:user_id>/deactivate', methods=['PUT'])
@jwt_required()
def deactivate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.is_active = False
    db.session.commit()

    return jsonify({"message": "User deactivated successfully"}), 200

@user_routes.route('/users/<int:user_id>/activate', methods=['PUT'])
@jwt_required()
def activate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.is_active = True
    db.session.commit()

    return jsonify({"message": "User activated successfully"}), 200

@user_routes.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if current_user.role != UserRole.ADMIN:
        return jsonify({"message": "Unauthorized"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    
    Request.query.filter_by(user_id=user.id).delete()
    Request.query.filter_by(reviewed_by_id=user.id).delete()

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

@user_routes.route('/users/<int:user_id>/requests/active', methods=['GET'])
def get_user_active_requests(user_id):
    active_requests = Request.query.filter(Request.user_id == user_id, Request.status != "COMPLETED").all()
    return jsonify({'active_requests': [req.to_dict() for req in active_requests]}), 200

@user_routes.route('/users/<int:user_id>/requests/completed', methods=['GET'])
def get_user_completed_requests(user_id):
    completed_requests = Request.query.filter(Request.user_id == user_id, Request.status == "COMPLETED").all()
    return jsonify({'completed_requests': [req.to_dict() for req in completed_requests]}), 200

@user_routes.route('/managers', methods=['GET'])
def get_managers():
    # Retrieve users where the role is PROCUREMENT_MANAGER.
    # If you want to include more roles (e.g., ADMIN), use .in_([UserRole.PROCUREMENT_MANAGER, UserRole.ADMIN])
    managers = User.query.filter(User.role == UserRole.PROCUREMENT_MANAGER).all()
    return jsonify({'managers': [manager.to_dict() for manager in managers]}), 200

@user_routes.route('/admins', methods=['GET'])
def get_admins():
    admins = User.query.filter(User.role == UserRole.ADMIN).all()
    return jsonify({'admins': [admin.to_dict() for admin in admins]}), 200

@user_routes.route('/employees', methods=['GET'])
def get_employees():
    employees = User.query.filter(User.role == UserRole.EMPLOYEE).all()
    return jsonify({'employees': [employee.to_dict() for employee in employees]}), 200



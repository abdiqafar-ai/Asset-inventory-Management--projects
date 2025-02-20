from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, Request, User  # Ensure User model is imported if needed

notifications_routes = Blueprint("notifications_routes", __name__)


@notifications_routes.route('/notifications', methods=['POST'])
@jwt_required()
def create_notification():
    """
    Create a new notification for the logged-in user.
    """
    data = request.json
    user_id = data.get('user_id')  # Allow specifying recipient user ID
    request_id = data.get('request_id')
    message = data.get('message')

    if not user_id or not request_id or not message:
        return jsonify({"error": "Missing user_id, request_id, or message"}), 400

    # Check if the request exists
    request_obj = Request.query.get(request_id)
    if not request_obj:
        return jsonify({"error": "Request not found"}), 404

    # Create and save notification
    notification = Notification(user_id=user_id, request_id=request_id, message=message)
    db.session.add(notification)
    db.session.commit()

    return jsonify(notification.to_dict()), 201


@notifications_routes.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """
    Fetch all notifications. 
    - Regular users see only their notifications. 
    - Admins see all notifications (assuming role-based access).
    """
    current_user_id = get_jwt_identity()
    
    # Optionally filter by user_id if provided in query (admins only)
    user_id = request.args.get("user_id", type=int)

    if user_id and current_user_id != user_id:
        # Check if current user is an admin (modify this based on your User model)
        user = User.query.get(current_user_id)
        if not user or user.role != "admin":
            return jsonify({"error": "Unauthorized"}), 403

    user_id = user_id or current_user_id  # Default to the logged-in user
    notifications = Notification.query.filter_by(user_id=user_id).all()

    return jsonify([n.to_dict() for n in notifications]), 200


@notifications_routes.route("/notifications/<int:notification_id>/read", methods=["PUT"])
@jwt_required()
def mark_notification_as_read(notification_id):
    """
    Mark a notification as read for the logged-in user.
    """
    user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()

    if not notification:
        return jsonify({"error": "Notification not found"}), 404

    notification.read = True
    db.session.commit()

    return jsonify({"message": "Notification marked as read", "notification": notification.to_dict()}), 200

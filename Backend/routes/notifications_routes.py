from flask import Blueprint, jsonify, request
from models import db, Notification, Request, User
from werkzeug.exceptions import BadRequest, NotFound
import traceback

notifications_routes = Blueprint("notifications_routes", __name__)

@notifications_routes.route('/notifications', methods=['POST'])
def create_notification():
    """
    Create a new notification.
    """
    try:
        data = request.json
        user_id = data.get('user_id')  # Allow specifying recipient user ID
        request_id = data.get('request_id')
        message = data.get('message')

        if not user_id or not request_id or not message:
            raise BadRequest("Missing user_id, request_id, or message")

        # Check if the user exists
        user = User.query.get(user_id)
        if not user:
            raise NotFound("User not found")

        # Check if the request exists
        request_obj = Request.query.get(request_id)
        if not request_obj:
            raise NotFound("Request not found")

        # Create and save notification
        notification = Notification(user_id=user_id, request_id=request_id, message=message)
        db.session.add(notification)
        db.session.commit()

        return jsonify(notification.to_dict()), 201
    except BadRequest as e:
        return jsonify({"message": str(e)}), 400
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@notifications_routes.route('/notifications', methods=['GET'])
def get_notifications():
    """
    Fetch all notifications.
    """
    try:
        user_id = request.args.get("user_id", type=int)

        if user_id:
            notifications = Notification.query.filter_by(user_id=user_id).all()
        else:
            notifications = Notification.query.all()

        return jsonify([n.to_dict() for n in notifications]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@notifications_routes.route("/notifications/<int:notification_id>/read", methods=["PUT"])
def mark_notification_as_read(notification_id):
    """
    Mark a notification as read.
    """
    try:
        notification = Notification.query.get(notification_id)

        if not notification:
            raise NotFound("Notification not found")

        notification.read = True
        db.session.commit()

        return jsonify({"message": "Notification marked as read", "notification": notification.to_dict()}), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@notifications_routes.route("/notifications/<int:notification_id>", methods=["DELETE"])
def delete_notification(notification_id):
    """
    Delete a notification by its ID.
    """
    try:
        notification = Notification.query.get(notification_id)
        if not notification:
            raise NotFound("Notification not found")

        db.session.delete(notification)
        db.session.commit()

        return jsonify({"message": "Notification deleted successfully"}), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500
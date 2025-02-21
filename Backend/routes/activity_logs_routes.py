from flask import Blueprint, request, jsonify
from models import db, ActivityLog, User
from werkzeug.exceptions import BadRequest, NotFound
import traceback

activity_logs_routes = Blueprint("activity_logs_routes", __name__)

@activity_logs_routes.route("/activity-logs", methods=["GET"])
def get_all_logs():
    try:
        logs = ActivityLog.query.all()
        return jsonify([log.to_dict() for log in logs]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@activity_logs_routes.route("/activity-logs/user/<int:user_id>", methods=["GET"])
def get_user_logs(user_id):
    try:
        logs = ActivityLog.query.filter_by(user_id=user_id).all()
        return jsonify([log.to_dict() for log in logs]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@activity_logs_routes.route("/activity-logs", methods=["POST"])
def create_activity_log():
    try:
        data = request.get_json()
        
        if not data or "user_id" not in data or "action" not in data:
            raise BadRequest("Missing required fields")

        user = User.query.get(data["user_id"])
        if not user:
            raise NotFound("User not found")

        new_log = ActivityLog(user_id=data["user_id"], action=data["action"])
        db.session.add(new_log)
        db.session.commit()

        return jsonify({"message": "Activity log created successfully", "log": new_log.to_dict()}), 201
    except BadRequest as e:
        return jsonify({"message": str(e)}), 400
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@activity_logs_routes.route("/activity-logs/<int:log_id>", methods=["GET"])
def get_log_by_id(log_id):
    try:
        log = ActivityLog.query.get(log_id)
        if not log:
            raise NotFound("Activity log not found")
        return jsonify(log.to_dict()), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@activity_logs_routes.route("/activity-logs/<int:log_id>", methods=["PUT"])
def update_activity_log(log_id):
    try:
        log = ActivityLog.query.get(log_id)
        if not log:
            raise NotFound("Activity log not found")

        data = request.get_json()
        log.action = data.get('action', log.action)
        db.session.commit()

        return jsonify({"message": "Activity log updated successfully", "log": log.to_dict()}), 200
    except BadRequest as e:
        return jsonify({"message": str(e)}), 400
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@activity_logs_routes.route("/activity-logs/<int:log_id>", methods=["DELETE"])
def delete_activity_log(log_id):
    try:
        log = ActivityLog.query.get(log_id)
        if not log:
            raise NotFound("Activity log not found")

        db.session.delete(log)
        db.session.commit()

        return jsonify({"message": "Activity log deleted successfully"}), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500
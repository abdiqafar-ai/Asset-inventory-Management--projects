from flask import Blueprint, request, jsonify
from models import db, ActivityLog

activity_logs_routes = Blueprint("activity_logs_routes", __name__)

@activity_logs_routes.route("/activity-logs/", methods=["GET"])
def get_all_logs():
    logs = ActivityLog.query.all()
    return jsonify([log.to_dict() for log in logs])

@activity_logs_routes.route("/activity-logs/user/<int:user_id>", methods=["GET"])
def get_user_logs(user_id):
    logs = ActivityLog.query.filter_by(user_id=user_id).all()
    return jsonify([log.to_dict() for log in logs])

# **New: Allow manual activity log creation**
@activity_logs_routes.route("/activity-logs/", methods=["POST"])
def create_activity_log():
    data = request.get_json()
    
    if not data or "user_id" not in data or "action" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    new_log = ActivityLog(user_id=data["user_id"], action=data["action"])
    db.session.add(new_log)
    db.session.commit()

    return jsonify({"message": "Activity log created successfully"}), 201

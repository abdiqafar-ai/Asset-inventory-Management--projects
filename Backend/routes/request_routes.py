from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, AssetRequest

request_routes = Blueprint("request_routes", __name__)

@request_routes.route('/requests', methods=['POST'])
@jwt_required()
def create_request():
    current_user = get_jwt_identity()
    data = request.json
    request_entry = AssetRequest(
        user_id=current_user['id'],
        asset_name=data['asset_name'],
        reason=data['reason'],
        urgency=data['urgency']
    )
    db.session.add(request_entry)
    db.session.commit()
    return jsonify({"message": "Request submitted"}), 201

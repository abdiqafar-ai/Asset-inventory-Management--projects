from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Request, db

request_bp = Blueprint('requests', __name__)

@request_bp.route('/', methods=['POST'])
@jwt_required()
def create_request():
    data = request.get_json()
    current_user = get_jwt_identity()
    new_request = Request(user_id=current_user['id'], asset_id=data.get('asset_id'), request_type=data['request_type'], urgency=data['urgency'], reason=data['reason'])
    db.session.add(new_request)
    db.session.commit()
    return jsonify({'message': 'Request created successfully'}), 201

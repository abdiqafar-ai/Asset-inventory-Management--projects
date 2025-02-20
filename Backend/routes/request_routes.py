from flask import Blueprint, request, jsonify
from models import db, User, Request, RequestStatus

request_routes = Blueprint('request_routes', __name__)

@request_routes.route('/create', methods=['POST'])
def create_request():
    data = request.get_json()
    
    new_request = Request(
        user_id=data['user_id'],
        asset_id=data['asset_id'],
        request_type=data['request_type'],
        reason=data['reason'],
        quantity=data['quantity'],
        urgency=data['urgency']
    )
    
    db.session.add(new_request)
    db.session.commit()
    
    return jsonify({"message": "Request created successfully"}), 201

@request_routes.route('/<int:request_id>/approve', methods=['PUT'])
def approve_request(request_id):
    request_item = Request.query.get(request_id)
    if not request_item:
        return jsonify({"message": "Request not found"}), 404
    
    manager_id = request.json['manager_id']
    manager = User.query.get(manager_id)
    if not manager:
        return jsonify({"message": "Manager not found"}), 404
    
    request_item.approve(manager_id)
    db.session.commit()
    
    return jsonify({"message": "Request approved"}), 200

@request_routes.route('/<int:request_id>/reject', methods=['PUT'])
def reject_request(request_id):
    request_item = Request.query.get(request_id)
    if not request_item:
        return jsonify({"message": "Request not found"}), 404
    
    manager_id = request.json['manager_id']
    manager = User.query.get(manager_id)
    if not manager:
        return jsonify({"message": "Manager not found"}), 404
    
    request_item.reject(manager_id)
    db.session.commit()
    
    return jsonify({"message": "Request rejected"}), 200

@request_routes.route('', methods=['GET'])  # Remove trailing slash in route definition
def get_requests():
    status = request.args.get('status')
    requests = Request.query.filter_by(status=status).all()
    return jsonify([req.to_dict() for req in requests])

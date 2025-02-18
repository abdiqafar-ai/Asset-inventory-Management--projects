from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Asset, User

asset_routes = Blueprint("asset_routes", __name__)

@asset_routes.route('/assets', methods=['GET'])
@jwt_required()
def get_assets():
    assets = Asset.query.all()
    return jsonify([{"id": a.id, "name": a.name, "category": a.category, "status": a.status} for a in assets])

@asset_routes.route('/assets', methods=['POST'])
@jwt_required()
def create_asset():
    current_user = get_jwt_identity()
    if current_user['role'] != "procurement_manager":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    asset = Asset(name=data['name'], category=data['category'], image_url=data.get('image_url'))
    db.session.add(asset)
    db.session.commit()
    return jsonify({"message": "Asset added"}), 201

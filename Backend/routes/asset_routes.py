from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Asset

asset_bp = Blueprint('assets', __name__)

@asset_bp.route('/', methods=['GET'])
@jwt_required()
def get_assets():
    assets = Asset.query.all()
    return jsonify([{'id': a.id, 'name': a.name, 'category': a.category.name, 'assigned_to': a.assigned_to} for a in assets])

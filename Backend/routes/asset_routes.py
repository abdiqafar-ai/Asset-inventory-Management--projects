from flask import Blueprint, request, jsonify
from models import db, Category, Asset

asset_bp = Blueprint('asset_bp', __name__)

@asset_bp.route('/add', methods=['POST'])
def add_asset():
    data = request.get_json()
    
    category = Category.query.filter_by(id=data['category_id']).first()
    if not category:
        return jsonify({"message": "Category not found"}), 404
    
    new_asset = Asset(
        name=data['name'],
        description=data['description'],
        status=data['status'],
        image_url=data['image_url'],
        category_id=data['category_id'],
        allocated_to=data.get('allocated_to')
    )
    
    db.session.add(new_asset)
    db.session.commit()
    
    return jsonify({"message": "Asset added successfully"}), 201

@asset_bp.route('/categories', methods=['POST'])
def add_category():
    data = request.get_json()
    
    new_category = Category(
        name=data['name']
    )
    
    db.session.add(new_category)
    db.session.commit()
    
    return jsonify({"message": "Category added successfully"}), 201

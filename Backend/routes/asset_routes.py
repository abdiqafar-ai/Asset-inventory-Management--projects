import traceback
from flask import Blueprint, request, jsonify
from models import db, Category, Asset, User
from werkzeug.exceptions import BadRequest, NotFound

asset_bp = Blueprint('asset_bp', __name__)

# Add an Asset
@asset_bp.route('/add', methods=['POST'])
def add_asset():
    try:
        data = request.get_json()

        if not data:
            raise BadRequest("Invalid JSON data")

        if Asset.query.filter_by(name=data['name']).first():
            return jsonify({"message": "Asset already exists"}), 400

        category = Category.query.filter_by(id=data['category_id']).first()
        if not category:
            raise NotFound("Category not found")

        # Assign asset to a Procurement Manager if allocated_to is not provided
        allocated_to = data.get('allocated_to')
        if not allocated_to:
            procurement_manager = db.session.query(User.id).filter_by(role='PROCUREMENT_MANAGER').first()
            if not procurement_manager:
                return jsonify({"message": "No Procurement Manager found"}), 400
            allocated_to = procurement_manager.id

        new_asset = Asset(
            name=data['name'],
            description=data['description'],
            status=data['status'],
            image_url=data['image_url'],
            category_id=data['category_id'],
            allocated_to=allocated_to
        )

        db.session.add(new_asset)
        db.session.commit()

        return jsonify({"message": "Asset added successfully"}), 201
    except BadRequest as e:
        return jsonify({"message": str(e)}), 400
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500


# Add a Category
@asset_bp.route('/categories', methods=['POST'])
def add_category():
    try:
        data = request.get_json()

        if not data:
            raise BadRequest("Invalid JSON data")

        if Category.query.filter_by(name=data['name']).first():
            return jsonify({"message": "Category already exists"}), 400

        new_category = Category(
            name=data['name']
        )

        db.session.add(new_category)
        db.session.commit()

        return jsonify({"message": "Category added successfully"}), 201
    except BadRequest as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# View All Categories
@asset_bp.route('/categories', methods=['GET'])
def view_all_categories():
    try:
        categories = Category.query.all()
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# View All Assets
@asset_bp.route('', methods=['GET'])
def view_all_assets():
    try:
        assets = Asset.query.all()
        return jsonify([asset.to_dict() for asset in assets]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# View Assets by Category
@asset_bp.route('/category/<int:category_id>', methods=['GET'])
def view_assets_by_category(category_id):
    try:
        assets = Asset.query.filter_by(category_id=category_id).all()
        return jsonify([asset.to_dict() for asset in assets]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# View Assets by Category Name
@asset_bp.route('/category/name/<name>', methods=['GET'])
def view_assets_by_category_name(name):
    try:
        category = Category.query.filter_by(name=name).first()
        if not category:
            raise NotFound("Category not found")

        assets = Asset.query.filter_by(category_id=category.id).all()
        return jsonify([asset.to_dict() for asset in assets]), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# View Assets by Status
@asset_bp.route('/status/<status>', methods=['GET'])
def view_assets_by_status(status):
    try:
        assets = Asset.query.filter_by(status=status).all()
        return jsonify([asset.to_dict() for asset in assets]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# View a Single Asset by ID
@asset_bp.route('/<int:asset_id>', methods=['GET'])
def view_asset_by_id(asset_id):
    try:
        asset = Asset.query.get(asset_id)
        if not asset:
            raise NotFound("Asset not found")
        return jsonify(asset.to_dict()), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# View a Single Asset by Name
@asset_bp.route('/name/<name>', methods=['GET'])
def view_asset_by_name(name):
    try:
        asset = Asset.query.filter_by(name=name).first()
        if not asset:
            raise NotFound("Asset not found")
        return jsonify(asset.to_dict()), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# View Assets by Allocation
@asset_bp.route('/allocated', methods=['GET'])
def view_assets_by_allocation():
    try:
        assets = Asset.query.filter(Asset.allocated_to.isnot(None)).all()
        return jsonify([asset.to_dict() for asset in assets]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# Search Assets
@asset_bp.route('/search/<query>', methods=['GET'])
def search_assets(query):
    try:
        assets = Asset.query.filter(Asset.name.contains(query) | Asset.description.contains(query)).all()
        return jsonify([asset.to_dict() for asset in assets]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# Update an Asset
@asset_bp.route('/<int:asset_id>', methods=['PUT'])
def update_asset(asset_id):
    try:
        asset = Asset.query.get(asset_id)
        if not asset:
            raise NotFound("Asset not found")

        data = request.get_json()
        asset.name = data.get('name', asset.name)
        asset.description = data.get('description', asset.description)
        asset.status = data.get('status', asset.status)
        asset.image_url = data.get('image_url', asset.image_url)
        asset.allocated_to = data.get('allocated_to', asset.allocated_to)
        db.session.commit()

        return jsonify({"message": "Asset updated successfully"}), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

# Delete an Asset
@asset_bp.route('/<int:asset_id>', methods=['DELETE'])
def delete_asset(asset_id):
    try:
        asset = Asset.query.get(asset_id)
        if not asset:
            raise NotFound("Asset not found")

        db.session.delete(asset)
        db.session.commit()

        return jsonify({"message": "Asset deleted successfully"}), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

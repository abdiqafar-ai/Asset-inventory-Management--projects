from flask import Blueprint, request, jsonify
from models import db, User, Request, Asset
from werkzeug.exceptions import BadRequest, NotFound
import traceback

request_routes = Blueprint('request_routes', __name__)

@request_routes.route('/create', methods=['POST'])
def create_request():
    try:
        data = request.get_json()
        if not data:
            raise BadRequest("Invalid JSON data")
        
        user = User.query.get(data['user_id'])
        if not user:
            raise NotFound("User not found")
        
        asset = Asset.query.get(data['asset_id'])
        if not asset:
            raise NotFound("Asset not found")
        
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
        
        return jsonify({"message": "Request created successfully", "request": new_request.to_dict()}), 201
    except BadRequest as e:
        return jsonify({"message": str(e)}), 400
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/<int:request_id>/approve', methods=['PUT'])
def approve_request(request_id):
    try:
        request_item = Request.query.get(request_id)
        if not request_item:
            raise NotFound("Request not found")
        
        data = request.get_json()
        manager_id = data.get('manager_id')
        manager = User.query.get(manager_id)
        if not manager:
            raise NotFound("Manager not found")


        request_item.approve(manager_id)
        db.session.commit()
        
        return jsonify({"message": "Request approved", "request": request_item.to_dict()}), 200
    except BadRequest as e:
        return jsonify({"message": str(e)}), 400
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/<int:request_id>/reject', methods=['PUT'])
def reject_request(request_id):
    try:
        request_item = Request.query.get(request_id)
        if not request_item:
            raise NotFound("Request not found")
        
        data = request.get_json()
        manager_id = data.get('manager_id')
        manager = User.query.get(manager_id)
        if not manager:
            raise NotFound("Manager not found")


        request_item.reject(manager_id)
        db.session.commit()
        
        return jsonify({"message": "Request rejected", "request": request_item.to_dict()}), 200
    except BadRequest as e:
        return jsonify({"message": str(e)}), 400
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('', methods=['GET'])
def get_requests():
    try:
        status = request.args.get('status')
        if status:
            requests = Request.query.filter_by(status=status).all()
        else:
            requests = Request.query.all()
        
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/<int:request_id>', methods=['GET'])
def view_request_by_id(request_id):
    try:
        request_item = Request.query.get(request_id)
        if not request_item:
            raise NotFound("Request not found")
        
        return jsonify(request_item.to_dict()), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/user/<int:user_id>', methods=['GET'])
def view_requests_by_user_id(user_id):
    try:
        requests = Request.query.filter_by(user_id=user_id).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/user/username/<username>', methods=['GET'])
def view_requests_by_user_username(username):
    try:
        user = User.query.filter_by(username=username).first()
        if not user:
            raise NotFound("User not found")
        
        requests = Request.query.filter_by(user_id=user.id).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/asset/<int:asset_id>', methods=['GET'])
def view_requests_by_asset_id(asset_id):
    try:
        requests = Request.query.filter_by(asset_id=asset_id).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/asset/name/<name>', methods=['GET'])
def view_requests_by_asset_name(name):
    try:
        requests = Request.query.join(Asset).filter(Asset.name == name).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/type/<request_type>', methods=['GET'])
def view_requests_by_request_type(request_type):
    try:
        requests = Request.query.filter_by(request_type=request_type).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/urgency/<urgency>', methods=['GET'])
def view_requests_by_urgency(urgency):
    try:
        requests = Request.query.filter_by(urgency=urgency).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/date-range', methods=['GET'])
def view_requests_by_date_range():
    try:
        data = request.get_json()
        start_date = data['start_date']
        end_date = data['end_date']
        requests = Request.query.filter(Request.created_at.between(start_date, end_date)).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/manager/<int:manager_id>', methods=['GET'])
def view_requests_by_manager_id(manager_id):
    try:
        requests = Request.query.filter_by(reviewed_by_id=manager_id).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/<int:request_id>', methods=['PUT'])
def update_request(request_id):
    try:
        request_item = Request.query.get(request_id)
        if not request_item:
            raise NotFound("Request not found")
        
        data = request.get_json()
        request_item.request_type = data.get('request_type', request_item.request_type)
        request_item.reason = data.get('reason', request_item.reason)
        request_item.quantity = data.get('quantity', request_item.quantity)
        request_item.urgency = data.get('urgency', request_item.urgency)
        db.session.commit()
        
        return jsonify({"message": "Request updated successfully", "request": request_item.to_dict()}), 200
    except BadRequest as e:
        return jsonify({"message": str(e)}), 400
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500

@request_routes.route('/<int:request_id>', methods=['DELETE'])
def delete_request(request_id):
    try:
        request_item = Request.query.get(request_id)
        if not request_item:
            raise NotFound("Request not found")
        
        db.session.delete(request_item)
        db.session.commit()
        
        return jsonify({"message": "Request deleted successfully"}), 200
    except NotFound as e:
        return jsonify({"message": str(e)}), 404
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "An unexpected error occurred"}), 500
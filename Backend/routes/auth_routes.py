from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from models import db, User, UserRole
from flask_bcrypt import Bcrypt
import string
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

auth_routes = Blueprint("auth_routes", __name__)
bcrypt = Bcrypt()


blacklisted_tokens = set()


def generate_reset_token(length=32):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))


def send_email(subject, recipient, body):
    sender_email = "abdiqafar.ibrahim@student.moringaschool.com"
    sender_password = "veyg hvrg bpjg yxwi"
    smtp_server = "smtp.gmail.com" 
    smtp_port = 587

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient, msg.as_string())
        server.close()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.get_json()

 
    if not all(key in data for key in ["username", "email", "password", "role"]):
        return jsonify({"error": "All fields (username, email, password, role) are required"}), 400


    role_str = data["role"].strip().upper().replace(" ", "_")


    if role_str not in UserRole.__members__:
        return jsonify({"error": "Invalid role"}), 400


    if User.query.filter_by(username=data["username"]).first() or User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "User already exists"}), 409


    new_user = User(
        username=data["username"],
        email=data["email"],
        role=UserRole[role_str]
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401


    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "role": user.role.name  
    }), 200

@auth_routes.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  
    blacklisted_tokens.add(jti) 

    return jsonify({"message": "Logout successful"}), 200

@auth_routes.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)

    return jsonify({"access_token": new_access_token}), 200

@auth_routes.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify(user.to_dict()), 200

@auth_routes.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()

    if not data.get("email"):
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    
    reset_token = generate_reset_token()

    
    user.reset_token = reset_token
    db.session.commit()


    reset_link = f"http://localhost:3000/reset-password/{reset_token}"
    email_subject = "Password Reset Request"
    email_body = f"Click the link to reset your password: {reset_link}"

    if send_email(email_subject, user.email, email_body):
        return jsonify({"message": "Password reset email sent"}), 200
    else:
        return jsonify({"error": "Failed to send email"}), 500

@auth_routes.route("/reset-password/<reset_token>", methods=["POST"])
def reset_password(reset_token):
    data = request.get_json()

    print(f"Reset token received: {reset_token}")
    print(f"Request body: {data}")

    if not data.get("password"):
        return jsonify({"error": "Password is required"}), 400

    user = User.query.filter_by(reset_token=reset_token).first()
    
    if not user:
        print("User not found or token expired")
        return jsonify({"error": "Invalid or expired reset token"}), 400

    print(f"User found: {user.email}")


    user.set_password(data["password"])
    user.reset_token = None
    db.session.commit()

    print("Password reset successful")

    return jsonify({"message": "Password reset successful"}), 200

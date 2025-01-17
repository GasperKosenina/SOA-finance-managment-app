from functools import wraps
from flask import request, jsonify
import requests


def validate_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from header
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Missing or invalid authorization header"}), 401

        token = auth_header.split(" ")[1]

        # Validate token with auth service
        try:
            response = requests.post(
                "http://auth_service:5555/api/validate", json={"token": token}
            )

            if response.status_code != 200:
                return jsonify({"message": "Invalid token"}), 401

            # Add user info to request context
            request.user = response.json()["user"]
            return f(*args, **kwargs)

        except requests.exceptions.RequestException as e:
            return jsonify({"message": "Auth service error"}), 500

    return decorated_function

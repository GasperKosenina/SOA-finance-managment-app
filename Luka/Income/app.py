from flask import Flask
from dotenv import load_dotenv
import os
from routes import income_routes
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS


def create_app():
    load_dotenv()
    app = Flask(__name__)

    CORS(app)

    SWAGGER_URL = "/swagger"
    API_URL = "/static/swagger.json"

    swagger_ui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': 'Income'
        }
    )

    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        raise Exception("MONGO_URI ni nastavljen!")

    app.register_blueprint(income_routes)
    app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)

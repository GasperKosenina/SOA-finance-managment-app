from flask import Flask
from pymongo import MongoClient
from controllers.expense import ExpenseController
from routes.expense import expense_routes
from extensions import app
from flask_swagger_ui import get_swaggerui_blueprint
import logging
from flask_cors import CORS


def create_app():
    app.logger.setLevel(logging.DEBUG)
    CORS(app)
    SWAGGER_URL = "/swagger"
    API_URL = "/static/swagger.json"
    swagger_ui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL, API_URL, config={"app_name": "Expenses API"}
    )

    client = MongoClient("mongodb://mongodb:27017/")
    db = client.expenses

    expense_controller = ExpenseController(db)
    expense_routes.expense_controller = expense_controller

    app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)
    app.register_blueprint(expense_routes, url_prefix="/expenses")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=8080, host="0.0.0.0")

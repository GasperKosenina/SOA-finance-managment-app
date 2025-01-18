from flask import Blueprint, request, jsonify
from models.expense import Expense
from extensions import app
from bson import ObjectId
from datetime import datetime
from calendar import monthrange
from decorators import validate_token
import os
import requests

expense_routes = Blueprint("expense_routes", __name__)

account_service_url = os.getenv("ACCOUNT_SERVICE_URL")


@expense_routes.route("/", methods=["POST"])
@validate_token
def create_expense():
    data = request.get_json()
    expense = Expense(
        data["amount"], data["name"], data["category"], data["date"], data["account_id"]
    )

    expense_routes.expense_controller.add_expense(expense)

    remove_user_balance = {
        "accountId": data["account_id"],
        "amount": data["amount"],
    }

    headers = {
        "Authorization": request.headers.get("Authorization"),
    }

    response = requests.put(
        f"{account_service_url}/user/remove-money",
        json=remove_user_balance,
        headers=headers,
    )

    if response.status_code != 200:
        return jsonify({"message": "Failed to update user balance"}), 400

    return jsonify({"message": "Expense created successfully"}), 201


@expense_routes.route("/multiple-expenses", methods=["POST"])
@validate_token
def create_multiple_expenses():
    data = request.get_json()
    expenses = []

    for expense_data in data["expenses"]:
        expense = Expense(
            expense_data["amount"],
            expense_data["name"],
            expense_data["category"],
            expense_data["date"],
            expense_data["account_id"],
        )
        expenses.append(expense)

    expense_routes.expense_controller.add_multiple_expenses(expenses)

    return jsonify({"message": f"Successfully created {len(expenses)} expenses"}), 201


@expense_routes.route("/", methods=["GET"])
@validate_token
def get_all_expenses():
    expenses = expense_routes.expense_controller.get_all_expenses()
    expenses_list = list(expenses)

    for expense in expenses_list:
        app.logger.info(f"Expense: {expense}")

    expense_objects = [
        Expense(
            expense["amount"],
            expense["name"],
            expense["category"],
            expense["date"],
            expense["account_id"],
            _id=expense["_id"],
        )
        for expense in expenses_list
    ]
    return jsonify([expense.to_dict() for expense in expense_objects]), 200


# Get all expenses by account id
@expense_routes.route("/account/<account_id>", methods=["GET"])
@validate_token
def get_expenses_by_account(account_id):
    expenses = expense_routes.expense_controller.get_expenses_by_account(account_id)
    expense_objects = [
        Expense(
            expense["amount"],
            expense["name"],
            expense["category"],
            expense["date"],
            expense["account_id"],
            _id=expense["_id"],
        )
        for expense in expenses
    ]
    return jsonify([expense.to_dict() for expense in expense_objects]), 200


# Get one expense by id
@expense_routes.route("/<expense_id>", methods=["GET"])
@validate_token
def get_expense_by_id(expense_id):

    expense = expense_routes.expense_controller.get_expense_by_id(ObjectId(expense_id))
    expense_object = Expense(
        expense["amount"],
        expense["name"],
        expense["category"],
        expense["date"],
        expense["account_id"],
        _id=expense["_id"],
    )
    return jsonify(expense_object.to_dict()), 200


# Get all expenses by account id and date
@expense_routes.route("/account/<account_id>/date/<date>", methods=["GET"])
@validate_token
def get_expenses_by_account_and_date(account_id, date):

    date_obj = datetime.strptime(date, "%Y-%m")
    year = date_obj.year
    month = date_obj.month
    _, last_day = monthrange(year, month)

    start_date = f"{year}-{month:02d}-01"
    end_date = f"{year}-{month:02d}-{last_day}"

    app.logger.info(f"Fetching expenses from {start_date} to {end_date}")

    expenses = expense_routes.expense_controller.get_expenses_by_month(
        account_id, start_date, end_date
    )

    expenses_list = list(expenses)
    expense_objects = [
        Expense(
            expense["amount"],
            expense["name"],
            expense["category"],
            expense["date"],
            expense["account_id"],
            _id=expense["_id"],
        )
        for expense in expenses_list
    ]
    return jsonify([expense.to_dict() for expense in expense_objects]), 200


# Update an expense
@expense_routes.route("/<expense_id>", methods=["PUT"])
@validate_token
def update_expense(expense_id):
    try:
        data = request.get_json()
        existing_expense = expense_routes.expense_controller.get_expense_by_id(
            ObjectId(expense_id)
        )

        app.logger.info(f"Existing expense: {existing_expense}")

        if not existing_expense:
            return jsonify({"message": "Expense not found"}), 404

        updated_expense = expense_routes.expense_controller.update_expense(
            ObjectId(expense_id),
            {
                "amount": data.get("amount", existing_expense["amount"]),
                "name": data.get("name", existing_expense["name"]),
                "category": data.get("category", existing_expense["category"]),
                "date": data.get("date", existing_expense["date"]),
                "account_id": data.get("account_id", existing_expense["account_id"]),
            },
        )

        if not updated_expense:
            return jsonify({"message": "Failed to update expense"}), 400

        return (
            jsonify(
                {
                    "_id": str(updated_expense["_id"]),
                    "amount": updated_expense["amount"],
                    "name": updated_expense["name"],
                    "category": updated_expense["category"],
                    "date": updated_expense["date"],
                    "account_id": updated_expense["account_id"],
                }
            ),
            200,
        )

    except Exception as e:
        app.logger.error(f"Error updating expense: {str(e)}")
        return jsonify({"message": "Error updating expense"}), 500


# Update all expenses by account id and category
@expense_routes.route("/account/<account_id>/category/<category>", methods=["PUT"])
@validate_token
def update_expenses_by_category(account_id, category):
    try:
        data = request.get_json()
        if not data or "new_category" not in data:
            return jsonify({"message": "New category is required"}), 400

        new_category = data["new_category"]

        app.logger.info(
            f"Updating expenses for account {account_id} from category '{category}' to '{new_category}'"
        )

        result = (
            expense_routes.expense_controller.update_expenses_by_category_and_account(
                account_id, category, new_category
            )
        )

        if result.modified_count > 0:
            return (
                jsonify(
                    {
                        "message": f"Successfully updated {result.modified_count} expenses from '{category}' to '{new_category}' for account {account_id}"
                    }
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {
                        "message": f"No expenses found in category '{category}' for account {account_id}"
                    }
                ),
                404,
            )

    except Exception as e:
        app.logger.error(f"Error updating expenses: {str(e)}")
        return jsonify({"message": "Error updating expenses"}), 500


# Delete all expenses by account id
@expense_routes.route("/account/<account_id>", methods=["DELETE"])
@validate_token
def delete_all_expenses(account_id):

    expense_routes.expense_controller.delete_all_expenses_by_account(account_id)
    return jsonify({"message": "All expenses deleted successfully"}), 200


# Delete an expense by id
@expense_routes.route("/<expense_id>", methods=["DELETE"])
@validate_token
def delete_expense(expense_id):
    expense_routes.expense_controller.delete_expense_by_id(ObjectId(expense_id))
    return jsonify({"message": "Expense deleted successfully"}), 200

from flask import Blueprint, jsonify, request
from controllers import get_savings, get_savings_by_account_and_date, post_saving, update_saving, delete_saving, get_saving_by_id, get_savings_by_account
import requests
import os
from datetime import datetime
from decorators import validate_token


income_service_url = os.getenv('INCOME_SERVICE_URL')


savings_routes = Blueprint('savings', __name__)


@savings_routes.route('/savings', methods=['GET'])
@validate_token
def pridobi_savings():
    try:
        savings_list = get_savings()
        return jsonify(savings_list), 200
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings/<id>', methods=['GET'])
@validate_token
def pridobi_saving(id):
    try:
        saving = get_saving_by_id(id)
        return jsonify(saving), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings', methods=['POST'])
@validate_token
def dodaj_saving():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Podatki niso poslani."}), 400
        inserted_id = post_saving(data)
        return jsonify({"message": "Prihranek uspešno dodan!", "id": inserted_id}), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings/<id>', methods=['PUT'])
@validate_token
def posodobi_saving(id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Podatki niso poslani."}), 400
        updated = update_saving(id, data)
        if updated:
            return jsonify({"message": "Prihranek uspešno posodobljen!"}), 200
        else:
            return jsonify({"error": "Posodobitev ni uspela."}), 400
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings/<id>', methods=['DELETE'])
@validate_token
def izbrisi_saving(id):
    try:
        deleted = delete_saving(id)
        if deleted:
            return jsonify({"message": "Prihranek uspešno izbrisan!"}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings/account/<account>', methods=['GET'])
@validate_token
def pridobi_savings_po_accountu(account):
    try:
        account_savings = get_savings_by_account(account)
        if not account_savings:
            return jsonify({"message": f"Uporabnik {account} nima prihrankov."}), 404
        return jsonify(account_savings), 200
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings/account/<account>', methods=['DELETE'])
@validate_token
def izbrisi_savings_po_accountu(account):
    try:
        account_savings = get_savings_by_account(account)
        if not account_savings:
            return jsonify({"message": f"Uporabnik {account} nima prihrankov za brisanje."}), 404

        for saving in account_savings:
            delete_saving(saving["_id"])

        return jsonify({"message": f"Vsi prihranki uporabnika {account} so izbrisani."}), 200
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings/summary/<account>', methods=['GET'])
@validate_token
def pridobi_summary_po_accountu(account):
    try:
        savings = get_savings_by_account(account) or []

        income_response = requests.get(
            f'{income_service_url}/income/account/{account}')
        if income_response.status_code == 200:
            income = income_response.json()
        else:
            income = []

        if not savings and not income:
            return jsonify({"error": f"Uporabnik {account} nima prihrankov ali dohodkov."}), 404

        total_savings = sum(saving['amount'] for saving in savings)
        total_income = sum(income_item['amount'] for income_item in income)

        return jsonify({
            "account": account,
            "total_savings": total_savings,
            "total_income": total_income,
            "savings_details": savings,
            "income_details": income
        }), 200

    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings/transfer', methods=['POST'])
@validate_token
def prenesi_v_prihranke():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Podatki niso poslani."}), 400

        account = data.get("account")
        amount = data.get("amount")
        income_id = data.get("income_id")
        name = data.get("name", "General Savings")

        if not account or not amount or amount <= 0 or not income_id:
            return jsonify({"error": "Manjkajo obvezni podatki ali znesek ni veljaven."}), 400

        income_response = requests.get(
            f'{income_service_url}/income/account/{account}')
        if income_response.status_code != 200:
            return jsonify({"error": f"Ni najdenih prihodkov za račun {account}."}), 404

        incomes = income_response.json()

        selected_income = next(
            (item for item in incomes if item["_id"] == income_id), None)
        if not selected_income:
            return jsonify({"error": "Dohodek z danim ID-jem ni najden."}), 404

        if selected_income["amount"] < amount:
            return jsonify({"error": "Ni dovolj sredstev v tem prihodku za prenos."}), 400

        saving_response = requests.post(
            f'http://localhost:5000/savings',
            json={
                "account": account,
                "amount": amount,
                "name": name
            }
        )

        if saving_response.status_code != 201:
            return jsonify({"error": "Napaka pri dodajanju prihranka."}), 500

        saving_data = saving_response.json()
        saving_data["createdAt"] = datetime.utcnow().strftime(
            "%a, %d %b %Y %H:%M:%S GMT")

        return jsonify({
            "message": "Znesek uspešno prenesen v prihranke.",
            "transferred_amount": amount,
            "saving_details": saving_data,
        }), 201

    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings/merge', methods=['PUT'])
@validate_token
def zdruzi_prihranke():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Podatki niso poslani."}), 400

        savings_ids = data.get("savings_ids")
        new_name = data.get("name", "Merged Savings")

        if not savings_ids or len(savings_ids) < 2:
            return jsonify({"error": "Za združitev morate navesti vsaj dva prihranka."}), 400

        savings_to_merge = [get_saving_by_id(sid) for sid in savings_ids]
        if not all(savings_to_merge):
            return jsonify({"error": "Eden ali več prihrankov z danimi ID-ji ne obstaja."}), 404

        total_amount = sum(saving["amount"] for saving in savings_to_merge)

        new_saving_data = {
            "account": savings_to_merge[0]["account"],
            "amount": total_amount,
            "name": new_name
        }
        new_saving_id = post_saving(new_saving_data)

        for saving in savings_to_merge:
            delete_saving(saving["_id"])

        return jsonify({
            "message": "Prihranki uspešno združeni!",
            "new_saving": {
                "id": new_saving_id,
                "account": new_saving_data["account"],
                "amount": new_saving_data["amount"],
                "name": new_saving_data["name"]
            }
        }), 200

    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@savings_routes.route('/savings/account/<account>/date/<date>', methods=['GET'])
@validate_token
def pridobi_savings_po_accountu_in_datu(account, date):
    try:
        account_savings = get_savings_by_account_and_date(account, date)

        if not account_savings:
            return jsonify({"message": f"Uporabnik {account} nima prihrankov za mesec {date}."}), 404
        return jsonify(account_savings), 200
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500

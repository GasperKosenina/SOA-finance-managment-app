from bson import ObjectId
from flask import Blueprint, jsonify, request
import requests
from controllers import get_incomes, get_income_by_id, get_incomes_by_account, post_income, update_income, delete_income, get_incomes_by_account_and_date
import os
from decorators import validate_token

income_routes = Blueprint('income', __name__)


account_service_url = os.getenv('ACCOUNT_SERVICE_URL')


@income_routes.route('/income', methods=['GET'])
@validate_token
def pridobi_incomes():
    try:
        incomes_list = get_incomes()
        return jsonify(incomes_list), 200
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@income_routes.route('/income/<id>', methods=['GET'])
@validate_token
def pridobi_income(id):
    try:
        income = get_income_by_id(id)
        return jsonify(income), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@income_routes.route('/income', methods=['POST'])
@validate_token
def dodaj_income():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Podatki niso poslani."}), 400

        accountId = data.get('account')
        amount = data.get('amount')

        if accountId is None:
            return jsonify({"error": "Manjka polje 'account'."}), 400
        if amount is None or not isinstance(amount, (int, float)):
            return jsonify({"error": "Manjka veljavno polje 'amount'."}), 400

        inserted_id = post_income(data)

        put_data = {
            "amount": str(amount),
            "accountId": accountId
        }

        response = requests.put(
            f'{account_service_url}/user/add-money', json=put_data)

        if response.status_code != 200:

            return jsonify({"error": "Napaka pri posodabljanju stanja računa."}), 502

        return jsonify({"message": "Dohodek uspešno dodan!", "id": inserted_id}), 201

    except ValueError as ve:

        return jsonify({"error": f"Napaka pri validaciji: {str(ve)}"}), 400

    except requests.RequestException as re:

        return jsonify({"error": "Napaka pri klicu zunanje storitve."}), 503

    except Exception as e:

        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@income_routes.route('/income/<id>', methods=['PUT'])
@validate_token
def posodobi_income(id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Podatki niso poslani."}), 400
        updated = update_income(id, data)
        if updated:
            return jsonify({"message": "Dohodek uspešno posodobljen!"}), 200
        else:
            return jsonify({"error": "Posodobitev ni uspela."}), 400
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@income_routes.route('/income/<id>', methods=['DELETE'])
@validate_token
def izbrisi_income(id):
    try:
        deleted = delete_income(id)
        if deleted:
            return jsonify({"message": "Dohodek uspešno izbrisan!"}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@income_routes.route('/income/account/<account>', methods=['GET'])
@validate_token
def pridobi_income_po_accountu(account):
    try:
        account_income = get_incomes_by_account(account)
        if not account_income:
            return jsonify({"message": f"Uporabnik {account} nima dohodkov."}), 404
        return jsonify(account_income), 200
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@income_routes.route('/income/account/<account>', methods=['DELETE'])
@validate_token
def izbrisi_incomes_po_accountu(account):
    try:
        account_incomes = get_incomes_by_account(account)
        if not account_incomes:
            return jsonify({"message": f"Uporabnik {account} nima dohodkov za brisanje."}), 404

        for income in account_incomes:
            delete_income(income["_id"])

        return jsonify({"message": f"Vsi dohodki uporabnika {account} so izbrisani."}), 200
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@income_routes.route('/income/split', methods=['POST'])
@validate_token
def razdeli_dohodek():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Podatki niso poslani."}), 400

        account = data.get("account")
        total_amount = data.get("total_amount")
        splits = data.get("splits")

        if not account or not total_amount or not splits or not isinstance(splits, list):
            return jsonify({"error": "Manjkajo obvezni podatki ali napačna struktura razdelitve."}), 400

        if sum(split["amount"] for split in splits) != total_amount:
            return jsonify({"error": "Vsota zneskov v razdelitvah ne ustreza skupnemu znesku."}), 400

        created_incomes = []

        for split in splits:
            new_income_data = {
                "account": account,
                "amount": split["amount"],
                "source": split.get("source", "Unknown"),
                "createdAt": split.get("createdAt")
            }
            inserted_id = post_income(new_income_data)

            created_incomes.append({"id": inserted_id, **new_income_data})

        for income in created_incomes:
            if isinstance(income.get("_id"), ObjectId):
                income["_id"] = str(income["_id"])

        return jsonify({
            "message": "Dohodek uspešno razdeljen in dodan!",
            "total_amount": total_amount,
            "details": created_incomes
        }), 201

    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@income_routes.route('/income/<id>/category', methods=['PUT'])
@validate_token
def posodobi_kategorijo(id):
    try:
        data = request.get_json()
        if not data or "category" not in data:
            return jsonify({"error": "Manjka polje 'category'."}), 400

        nova_kategorija = data["category"]

        updated = update_income(id, {"category": nova_kategorija})
        if updated:
            return jsonify({"message": "Kategorija uspešno posodobljena!", "new_category": nova_kategorija}), 200
        else:
            return jsonify({"error": "Posodobitev kategorije ni uspela."}), 400
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500


@income_routes.route('/income/account/<account>/date/<date>', methods=['GET'])
@validate_token
def pridobi_incomes_po_accountu_in_datu(account, date):
    try:
        account_incomes = get_incomes_by_account_and_date(account, date)

        if not account_incomes:
            return jsonify({"message": f"Uporabnik {account} nima prihodkov za mesec {date}."}), 404
        return jsonify(account_incomes), 200
    except Exception as e:
        return jsonify({"error": f"Napaka na strežniku: {str(e)}"}), 500

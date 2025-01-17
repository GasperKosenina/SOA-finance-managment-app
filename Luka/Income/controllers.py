from bson import ObjectId
from models import income
from datetime import datetime


def get_incomes():
    incomes_list = list(income.find())
    for i in incomes_list:
        i['_id'] = str(i['_id'])
    return incomes_list


def get_income_by_id(id):
    try:
        dohodek = income.find_one({"_id": ObjectId(id)})
        if not dohodek:
            raise ValueError(f"Dohodek ID-jem {id} ne obstaja.")
        dohodek['_id'] = str(dohodek['_id'])
        return dohodek
    except Exception as e:
        raise Exception(f"Napaka pri pridobivanju dohodka: {e}")


def post_income(data):
    try:
        required_fields = ["source", "amount", "account"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Manjka obvezno polje: {field}")

        if not isinstance(data["amount"], (int, float)):
            raise ValueError("Znesek mora biti število.")

        data["createdAt"] = datetime.utcnow()

        result = income.insert_one(data)
        return str(result.inserted_id)
    except Exception as e:
        raise Exception(f"Napaka pri dodajanju dohodka: {e}")


def update_income(id, data):
    try:
        existing = income.find_one({"_id": ObjectId(id)})
        if not existing:
            raise ValueError(f"Dohodek z ID-jem {id} ne obstaja.")

        result = income.update_one({"_id": ObjectId(id)}, {"$set": data})

        if result.matched_count == 0:
            raise ValueError("Posodabljanje ni uspelo.")

        return True
    except Exception as e:
        raise Exception(f"Napaka pri posodabljanju dohodka: {e}")


def delete_income(id):
    try:
        result = income.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            raise ValueError(
                f"Dohodek z ID-jem {id} ne obstaja."
            )

        return True
    except Exception as e:
        raise Exception(f"Napaka pri brisanju dohodka: {e}")


def get_incomes_by_account(account):
    try:
        incomes_list = list(income.find({"account": account}))
        for i in incomes_list:
            i["_id"] = str(i["_id"])
        return incomes_list
    except Exception as e:
        raise Exception(
            f"Napaka pri pridobivanju vseh dohodkov za uporabnika {account}:{e}")


def get_incomes_by_account_and_date(account, date):
    try:
        try:
            month_date = datetime.strptime(date, "%Y-%m")
        except ValueError:
            raise ValueError("Nepravilen format datuma. Uporabi YYYY-MM.")

        start_date = month_date
        end_date = datetime(month_date.year, month_date.month + 1,
                            1) if month_date.month < 12 else datetime(month_date.year + 1, 1, 1)

        income_list = list(income.find({
            "account": account,
            "createdAt": {"$gte": start_date, "$lt": end_date}
        }))

        for i in income_list:
            i["_id"] = str(i["_id"])

        return income_list
    except Exception as e:
        raise Exception(f"Napaka pri pridobivanju prihrankov za uporabnika")

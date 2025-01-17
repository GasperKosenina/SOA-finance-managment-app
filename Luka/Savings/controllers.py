from bson import ObjectId
from models import savings
from datetime import datetime


def get_savings():
    savings_list = list(savings.find())
    for saving in savings_list:
        saving['_id'] = str(saving['_id'])
    return savings_list


def get_saving_by_id(id):
    try:
        saving = savings.find_one({"_id": ObjectId(id)})
        if not saving:
            raise ValueError(f"Prihranki z ID-jem {id} ne obstajajo.")
        saving['_id'] = str(saving['_id'])
        return saving
    except Exception as e:
        raise Exception(f"Napaka pri pridobivanju prihrankov: {e}")


def post_saving(data):
    try:
        required_fields = ["name", "amount", "account"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Manjka obvezno polje: {field}")

        if not isinstance(data["amount"], (int, float)):
            raise ValueError("Znesek mora biti število.")

        data["createdAt"] = datetime.utcnow()

        result = savings.insert_one(data)
        return str(result.inserted_id)
    except Exception as e:
        raise Exception(f"Napaka pri dodajanju prihranka: {e}")


def update_saving(id, data):
    try:
        existing = savings.find_one({"_id": ObjectId(id)})
        if not existing:
            raise ValueError(f"Prihranek z ID-jem {id} ne obstaja.")

        result = savings.update_one({"_id": ObjectId(id)}, {"$set": data})

        if result.matched_count == 0:
            raise ValueError("Posodabljanje ni uspelo.")

        return True
    except Exception as e:
        raise Exception(f"Napaka pri posodabljanju prihranka: {e}")


def delete_saving(id):
    try:
        result = savings.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            raise ValueError(
                f"Prihranek z ID-jem {id} ne obstaja."
            )

        return True
    except Exception as e:
        raise Exception(f"Napaka pri brisanju prihranka: {e}")


def get_savings_by_account(account):
    try:
        savings_list = list(savings.find({"account": account}))
        for saving in savings_list:
            saving["_id"] = str(saving["_id"])
        return savings_list
    except Exception as e:
        raise Exception(
            f"Napaka pri pridobivanju vseh prihrankov za uporabnika {account}:{e}")


def get_savings_by_account_and_date(account, date):
    try:
        try:
            month_date = datetime.strptime(date, "%Y-%m")
        except ValueError:
            raise ValueError("Nepravilen format datuma. Uporabi YYYY-MM.")

        start_date = month_date
        end_date = datetime(month_date.year, month_date.month + 1,
                            1) if month_date.month < 12 else datetime(month_date.year + 1, 1, 1)

        savings_list = list(savings.find({
            "account": account,
            "createdAt": {"$gte": start_date, "$lt": end_date}
        }))

        for saving in savings_list:
            saving["_id"] = str(saving["_id"])

        return savings_list
    except Exception as e:
        raise Exception(f"Napaka pri pridobivanju prihrankov za uporabnika")

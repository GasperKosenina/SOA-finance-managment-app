class ExpenseController:
    def __init__(self, db):
        self.db = db
        self.collection = db.expenses

    def add_expense(self, expense):
        self.collection.insert_one(expense.to_dict())

    def add_multiple_expenses(self, expenses):
        self.collection.insert_many([expense.to_dict() for expense in expenses])

    def get_all_expenses(self):
        return self.collection.find()

    def get_expense_by_id(self, expense_id):
        return self.collection.find_one({"_id": expense_id})

    def get_expenses_by_account(self, account_id):
        return self.collection.find({"account_id": account_id})

    def get_expenses_by_month(self, account_id, start_date, end_date):
        return self.collection.find(
            {
                "account_id": account_id,
                "date": {
                    "$gte": start_date,
                    "$lte": end_date,
                },
            }
        )

    def update_expense(self, expense_id, expense_data):
        result = self.collection.find_one_and_update(
            {"_id": expense_id}, {"$set": expense_data}, return_document=True
        )
        return result

    def update_expenses_by_category_and_account(
        self, account_id, old_category, new_category
    ):
        result = self.collection.update_many(
            {"account_id": account_id, "category": old_category},
            {"$set": {"category": new_category}},
        )
        return result

    def delete_all_expenses_by_account(self, account_id):
        self.collection.delete_many({"account_id": account_id})

    def delete_expense_by_id(self, expense_id):
        self.collection.delete_one({"_id": expense_id})

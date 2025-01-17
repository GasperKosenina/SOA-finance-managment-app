class Expense:
    def __init__(self, amount, name, category, date, account_id, _id=None):
        self.amount = amount
        self.name = name
        self.category = category
        self.date = date
        self.account_id = account_id
        self._id = _id

    def to_dict(self):
        expense_dict = {
            "amount": self.amount,
            "name": self.name,
            "category": self.category,
            "date": self.date,
            "account_id": self.account_id,
        }
        if self._id:
            expense_dict["_id"] = str(self._id)
        return expense_dict

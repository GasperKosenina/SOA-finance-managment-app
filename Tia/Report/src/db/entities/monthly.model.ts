import { Schema, Document, Model, model } from 'mongoose';

export const MonthlySchema = new Schema({
  name: { type: String, required: true }, // Name of the report
  account_id: { type: String, required: true }, // User ID
  month: {
    type: Number,
    required: true,
    min: [1, 'Month must be at least 1'],
    max: [12, 'Month cannot be greater than 12'],
  },
  year: { type: Number, required: true },
  incomeSummary: [
    {
      source: String, // Income source
      totalAmount: Number, // Total amount for this source
      count: Number, // Count of income entries
    },
  ],
  expenseSummary: [
    {
      category: String, // Expense category
      totalAmount: Number, // Total amount for this category
      count: Number, // Count of expense entries
    },
  ],
  totalIncome: { type: Number, default: 0 }, // Total income amount
  totalExpenses: { type: Number, default: 0 }, // Total expense amount
  createdAt: { type: Date, default: Date.now },
});

export interface Monthly extends Document {
  name: string;
  account_id: string;
  month: number;
  year: number;
  incomeSummary: { source: string; totalAmount: number; count: number }[]; // za vsak source posebej, koliko denarja (totalAmount) in kolikokrat v tem source (count)
  expenseSummary: { category: string; totalAmount: number; count: number }[];
  totalIncome: number; // vse skupaj
  totalExpenses: number; // vse skupaj
  createdAt: Date;
}

export const MonthlyModel: Model<Monthly> = model<Monthly>(
  'Monthly',
  MonthlySchema,
);

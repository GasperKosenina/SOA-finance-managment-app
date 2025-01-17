import { Schema, Document, Model, model } from 'mongoose';

export const FullSchema = new Schema({
  name: { type: String, required: true },
  account_id: { type: String, required: true }, // User id aka Clerk
  incomeSummary: [
    {
      source: String, // Income source
      totalAmount: Number, // Total amount for this source
      count: Number, // Count of income entries
    },
  ],
  totalIncome: { type: Number, default: 0 }, // Total income amount
  createdAt: { type: Date, default: Date.now },
});

export interface Full extends Document {
  name: string;
  account_id: string;
  incomeSummary: { source: string; totalAmount: number; count: number }[];
  totalIncome: number;
  createdAt: Date;
}

export const FullModel: Model<Full> = model<Full>('Full', FullSchema);

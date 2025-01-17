import { Schema, Document, Model, model } from 'mongoose'

export const BankSchema = new Schema({
  bank_name: { type: String, required: true },
  account_name: { type: String, required: true },
  account_number: { type: String, required: true },
  iban: { type: String, required: true, lowercase: true },
  status: { type: Boolean, required: true }
})

export interface Bank extends Document {
  bank_name: string
  account_name: string
  account_number: string
  iban: string
  status: boolean
}

export const BankModel: Model<Bank> = model<Bank>('Bank', BankSchema)

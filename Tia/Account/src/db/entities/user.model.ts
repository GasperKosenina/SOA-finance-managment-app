import { Schema, Document, Model, model } from 'mongoose'
import { Bank } from './bank.model'

export const UserSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  bank_details: { type: Schema.Types.ObjectId, ref: 'Bank', required: true, default: null },
  account_id: { type: String },
  total: { type: Number, required: true, default: 0 }
})

export interface User extends Document {
  name: string
  surname: string
  email: string
  password: string
  bank_details: Bank
  account_id: string
  total: number
}

export const UserModel: Model<User> = model<User>('User', UserSchema)

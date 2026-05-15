export type FieldType = 'TEXT' | 'NUMBER' | 'EMAIL' | 'SELECT' | 'CHECKBOX';
export type SplitType = 'FIXED' | 'SLOT_BASED' | 'OPEN';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For 'SELECT' type
}

export type FormFieldInput = { 
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
}

export type CreateSplitInput = {
  title: string;
  totalAmount?: number;
  splitType: SplitType;
  numberOfSlots?: number;
  minimumAmount?: number;
  formData?: FormFieldInput[];
}

export interface FormResult {
  id: string;
  participantId: string;
  data: Record<string, any>;
  submittedAt: string;
  createdAt?: string;
}

export interface SplitParticipant {
  id: string;
  name: string;
  contact?: string;
  role: 'OBLIGATED' | 'CONTRIBUTOR';
  amountToPay?: number;
  amountPaid: number;
}

export interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  balance: number;
  splitId: string;
  transactions: Transaction[];
}

export interface SplitGroup {
  id: string;
  title: string;
  description: string;
  amount: number;
  totalCollected: number;
  participants: SplitParticipant[];
  link: string; // The shareable link identifier
  status: 'active' | 'completed';
  createdAt: string;
  creatorId: string;
}

export interface CreateSplitRequest {
  title: string;
  description: string;
  amount: number;
  participants: { name: string; email: string }[];
}

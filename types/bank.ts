export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  code: string;
  isDefault: boolean;
  bankCode?: string;
  userId: string;
  createdAt: string | Date;
}

export interface CreateBankInput {
  bankName: string;
  accountName: string;
  accountNumber: string;
  code: string;
}

export interface UpdateBankInput {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  code?: string;
}

export interface BankResponse {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  code: string;
  userId: string;
  createdAt: Date;
}

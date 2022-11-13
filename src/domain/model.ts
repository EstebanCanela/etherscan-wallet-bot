export enum TransactionType {
  TransferIn = "TRANSFER_IN",
  TransferOut = "TRANSFER_OUT",
}

export interface Transaction {
  type: TransactionType;
  amount: string;
  token: string;
  from: string;
  to: string;
  txn_id: string;
  date: string;
}

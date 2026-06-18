export type ReceiptType = 'ordinary' | 'extraordinary';
export type ReceiptStatus = 'paid' | 'pending' | 'claimed' | 'judicial';

export interface Receipt {
  id: string;
  receiptNumber: string;
  type: ReceiptType;
  ownerId: string;
  communityId: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;
  periodLabel: string;
  concept: string;
  amountCents: number;
  status: ReceiptStatus;
}

import axios from 'axios';

const API_BASE = '/api';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: 'credit' | 'debit';
}

export async function fetchRecentTransactions(): Promise<Transaction[]> {
  const response = await axios.get(`${API_BASE}/bank/transactions?limit=10`);
  return response.data.data.slice(0, 10);
}
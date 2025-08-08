import { useQuery } from '@tanstack/react-query';
import { fetchRecentTransactions } from '../api/transactions';

export default function TransactionList() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: fetchRecentTransactions,
    refetchInterval: 300000,
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-2">
      {transactions?.map((transaction) => (
        <div key={transaction.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
          <div>
            <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(transaction.date).toLocaleString('ja-JP')}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${
              transaction.type === 'credit' ? 'text-success-600' : 'text-danger-600'
            }`}>
              {transaction.type === 'credit' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              残高: ¥{transaction.balance.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
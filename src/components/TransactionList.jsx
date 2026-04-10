import TransactionItem from "./TransactionItem";

export default function TransactionList({
  transactions = [],
  onDelete,
  limit,
  emptyMessage = "No transactions yet.",
}) {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return (
      <div className="tx-list__empty">
        <span className="tx-list__empty-icon">◎</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="tx-list">
      {items.map((tx) => (
        <li key={tx.id}>
          <TransactionItem transaction={tx} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
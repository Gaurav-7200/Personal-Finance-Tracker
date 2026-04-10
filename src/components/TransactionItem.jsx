const categoryMeta = {
  Food:          { icon: "🍔", color: "#fbbf24" },
  Transport:     { icon: "🚗", color: "#60a5fa" },
  Shopping:      { icon: "🛍️", color: "#f472b6" },
  Bills:         { icon: "💡", color: "#a78bfa" },
  Entertainment: { icon: "🎉", color: "#34d399" },
  Salary:        { icon: "💼", color: "#34d399" },
  Freelance:     { icon: "💻", color: "#6ee7b7" },
  Investment:    { icon: "📈", color: "#c8f135" },
  Health:        { icon: "🏥", color: "#fb923c" },
  Other:         { icon: "◎",  color: "#6b6b80" },
};

export default function TransactionItem({ transaction, onDelete }) {
  const { id, amount, category, type, date } = transaction;
  const meta = categoryMeta[category] || categoryMeta["Other"];
  const isIncome = type === "income";
  const formattedAmount = `${isIncome ? "+" : "-"}₹${Math.abs(amount).toLocaleString("en-IN")}`;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    : "";

  return (
    <div className="tx-item">
      <div
        className="tx-item__icon"
        style={{ background: meta.color + "22", borderColor: meta.color + "44" }}
      >
        <span>{meta.icon}</span>
      </div>

      <div className="tx-item__info">
        <span className="tx-item__category">{category}</span>
        <span className="tx-item__type">{isIncome ? "Income" : "Expense"}</span>
      </div>

      {formattedDate && (
        <span className="tx-item__date">{formattedDate}</span>
      )}

      <span className={`tx-item__amount tx-item__amount--${type}`}>
        {formattedAmount}
      </span>

      {onDelete && (
        <button
          className="tx-item__delete"
          onClick={() => onDelete(id)}
          aria-label="Delete transaction"
        >
          ×
        </button>
      )}
    </div>
  );
}
import { useMemo } from "react";
import "./Activity.css";

function groupByDate(transactions) {
  const map = {};
  [...transactions].reverse().forEach(tx => {
    const date = tx.date
      ? new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "Unknown date";
    if (!map[date]) map[date] = [];
    map[date].push(tx);
  });
  return Object.entries(map);
}

function weeklyData(transactions) {
  const weeks = {};
  transactions.forEach(tx => {
    if (!tx.date) return;
    const d = new Date(tx.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    if (!weeks[key]) weeks[key] = { income: 0, expense: 0 };
    if (tx.type === "income")  weeks[key].income  += tx.amount;
    if (tx.type === "expense") weeks[key].expense += tx.amount;
  });
  return Object.entries(weeks).slice(-6);
}

export default function Activity({ transactions = [] }) {
  const grouped = useMemo(() => groupByDate(transactions), [transactions]);
  const weekly  = useMemo(() => weeklyData(transactions), [transactions]);
  const maxWeekly = useMemo(() => Math.max(...weekly.map(([, v]) => Math.max(v.income, v.expense)), 1), [weekly]);

  if (transactions.length === 0) {
    return (
      <div className="activity">
        <h1 className="activity__title">Activity</h1>
        <div className="activity__empty">
          <span>◈</span>
          <p>Add transactions to see your activity timeline.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity">
      <h1 className="activity__title">Activity</h1>
      <p className="activity__subtitle">Your financial timeline</p>

      {weekly.length > 1 && (
        <div className="activity__chart-card">
          <h2 className="activity__section-title">Weekly overview</h2>
          <div className="activity__chart">
            {weekly.map(([week, data]) => (
              <div className="activity__week-col" key={week}>
                <div className="activity__bars">
                  <div
                    className="activity__bar activity__bar--income"
                    style={{ height: `${(data.income / maxWeekly) * 80}px` }}
                    title={`Income ₹${data.income.toLocaleString("en-IN")}`}
                  />
                  <div
                    className="activity__bar activity__bar--expense"
                    style={{ height: `${(data.expense / maxWeekly) * 80}px` }}
                    title={`Expense ₹${data.expense.toLocaleString("en-IN")}`}
                  />
                </div>
                <span className="activity__week-label">{week}</span>
              </div>
            ))}
          </div>
          <div className="activity__legend">
            <span className="activity__legend-dot activity__legend-dot--income" /> Income
            <span className="activity__legend-dot activity__legend-dot--expense" /> Expense
          </div>
        </div>
      )}

      <div className="activity__timeline">
        {grouped.map(([date, txs]) => (
          <div className="activity__group" key={date}>
            <div className="activity__date-row">
              <span className="activity__date-line" />
              <span className="activity__date-label">{date}</span>
              <span className="activity__date-line" />
            </div>
            <div className="activity__group-items">
              {txs.map(tx => (
                <div className="activity__tx" key={tx.id}>
                  <span className={`activity__tx-dot activity__tx-dot--${tx.type}`} />
                  <span className="activity__tx-cat">{tx.category}</span>
                  <span className={`activity__tx-amt activity__tx-amt--${tx.type}`}>
                    {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
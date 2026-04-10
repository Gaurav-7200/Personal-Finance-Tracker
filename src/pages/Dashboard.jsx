import { useMemo } from "react";
import { Link } from "react-router-dom";
import TransactionList from "../components/TransactionList";
import "./Dashboard.css";

function SpendingMood({ ratio }) {
  if (ratio >= 0.8) return { emoji: "🚨", label: "Overspending", tone: "danger" };
  if (ratio >= 0.5) return { emoji: "😬", label: "High spending", tone: "warning" };
  if (ratio >= 0.2) return { emoji: "😃", label: "Balanced", tone: "neutral" };
  return { emoji: "🤑", label: "Saving well", tone: "good" };
}

export default function Dashboard({ transactions = [], onDelete }) {
  const stats = useMemo(() => {
    const income  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const ratio = stats.income > 0 ? stats.expense / stats.income : 0;
  const mood  = SpendingMood({ ratio });

  const categoryTotals = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [transactions]);

  const maxCat = categoryTotals[0]?.[1] || 1;

  const gradientClass = `dash__bg--${mood.tone}`;

  return (
    <div className={`dash ${gradientClass}`}>
      <header className="dash__header">
        <div>
          <h1 className="dash__title">Overview</h1>
          <p className="dash__subtitle">Your financial pulse</p>
        </div>
        <div className="dash__mood">
          <span className="dash__mood-emoji">{mood.emoji}</span>
          <span className="dash__mood-label">{mood.label}</span>
        </div>
      </header>

      <div className="dash__cards">
        <div className="dash__card dash__card--balance">
          <span className="dash__card-label">Net balance</span>
          <span className={`dash__card-value ${stats.balance < 0 ? "dash__card-value--neg" : ""}`}>
            ₹{Math.abs(stats.balance).toLocaleString("en-IN")}
          </span>
          {stats.balance < 0 && <span className="dash__card-tag">deficit</span>}
        </div>
        <div className="dash__card dash__card--income">
          <span className="dash__card-label">Total income</span>
          <span className="dash__card-value dash__card-value--income">
            ₹{stats.income.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="dash__card dash__card--expense">
          <span className="dash__card-label">Total expenses</span>
          <span className="dash__card-value dash__card-value--expense">
            ₹{stats.expense.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {stats.income > 0 && (
        <div className="dash__progress-section">
          <div className="dash__progress-header">
            <span className="dash__progress-label">Expense ratio</span>
            <span className="dash__progress-pct">{Math.round(ratio * 100)}%</span>
          </div>
          <div className="dash__progress-track">
            <div
              className="dash__progress-bar"
              style={{ width: `${Math.min(ratio * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="dash__bottom">
        {categoryTotals.length > 0 && (
          <div className="dash__section">
            <h2 className="dash__section-title">Top categories</h2>
            <div className="dash__cats">
              {categoryTotals.map(([cat, amt]) => (
                <div className="dash__cat-row" key={cat}>
                  <span className="dash__cat-name">{cat}</span>
                  <div className="dash__cat-bar-track">
                    <div
                      className="dash__cat-bar"
                      style={{ width: `${(amt / maxCat) * 100}%` }}
                    />
                  </div>
                  <span className="dash__cat-amt">₹{amt.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dash__section">
          <div className="dash__section-header">
            <h2 className="dash__section-title">Recent transactions</h2>
            <Link to="/transactions" className="dash__see-all">See all →</Link>
          </div>
          <TransactionList transactions={transactions} onDelete={onDelete} limit={5} />
        </div>
      </div>
    </div>
  );
}
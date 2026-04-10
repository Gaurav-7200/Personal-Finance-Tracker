import { useState, useMemo } from "react";
import TransactionList from "../components/TransactionList";
import "./Transactions.css";

const FILTERS = ["All", "Income", "Expense", "Food", "Transport", "Shopping", "Bills", "Entertainment"];

export default function Transactions({ transactions = [], onDelete }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...transactions].reverse();
    if (activeFilter !== "All") {
      const f = activeFilter.toLowerCase();
      list = list.filter(t => t.type === f || t.category.toLowerCase() === f);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(t =>
        t.category.toLowerCase().includes(s) ||
        String(t.amount).includes(s)
      );
    }
    return list;
  }, [transactions, activeFilter, search]);

  const totals = useMemo(() => ({
    income:  filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
    expense: filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
  }), [filtered]);

  return (
    <div className="txpage">
      <header className="txpage__header">
        <div>
          <h1 className="txpage__title">Transactions</h1>
          <p className="txpage__subtitle">{filtered.length} records</p>
        </div>
        <div className="txpage__totals">
          <div className="txpage__total txpage__total--income">
            <span>In</span>
            <strong>₹{totals.income.toLocaleString("en-IN")}</strong>
          </div>
          <div className="txpage__total txpage__total--expense">
            <span>Out</span>
            <strong>₹{totals.expense.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </header>

      <div className="txpage__search-wrap">
        <span className="txpage__search-icon">⌕</span>
        <input
          className="txpage__search"
          type="text"
          placeholder="Search by category or amount…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="txpage__search-clear" onClick={() => setSearch("")}>×</button>
        )}
      </div>

      <div className="txpage__filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`txpage__filter${activeFilter === f ? " active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <TransactionList
        transactions={filtered}
        onDelete={onDelete}
        emptyMessage="No transactions match this filter."
      />
    </div>
  );
}
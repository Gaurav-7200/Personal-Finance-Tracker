import { useState } from "react";
import "./AddTransaction.css";

const CATEGORIES = [
  { label: "Food",          icon: "🍔" },
  { label: "Transport",     icon: "🚗" },
  { label: "Shopping",      icon: "🛍️" },
  { label: "Bills",         icon: "💡" },
  { label: "Entertainment", icon: "🎉" },
  { label: "Salary",        icon: "💼" },
  { label: "Freelance",     icon: "💻" },
  { label: "Investment",    icon: "📈" },
  { label: "Health",        icon: "🏥" },
  { label: "Other",         icon: "◎"  },
];

const defaultForm = { amount: "", category: "Food", type: "expense" };

export default function AddTransaction({ onAdd }) {
  const [form, setForm]       = useState(defaultForm);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit() {
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    setError("");
    onAdd({ ...form, amount: amt, date: new Date().toISOString(), id: Date.now() });
    setForm(defaultForm);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  }

  return (
    <div className="addtx">
      <header className="addtx__header">
        <h1 className="addtx__title">Add transaction</h1>
        <p className="addtx__subtitle">Record a new income or expense</p>
      </header>

      <div className="addtx__card">
        {/* Type toggle */}
        <div className="addtx__field">
          <label className="addtx__label">Type</label>
          <div className="addtx__toggle">
            {["income", "expense"].map(t => (
              <button
                key={t}
                className={`addtx__toggle-btn addtx__toggle-btn--${t}${form.type === t ? " active" : ""}`}
                onClick={() => setForm(f => ({ ...f, type: t }))}
              >
                {t === "income" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="addtx__field">
          <label className="addtx__label" htmlFor="amount">Amount (₹)</label>
          <div className="addtx__input-wrap">
            <span className="addtx__prefix">₹</span>
            <input
              id="amount"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={form.amount}
              onChange={e => { setForm(f => ({ ...f, amount: e.target.value })); setError(""); }}
              className="addtx__input"
            />
          </div>
          {error && <p className="addtx__error">{error}</p>}
        </div>

        {/* Category */}
        <div className="addtx__field">
          <label className="addtx__label">Category</label>
          <div className="addtx__cats">
            {CATEGORIES.map(({ label, icon }) => (
              <button
                key={label}
                className={`addtx__cat-btn${form.category === label ? " active" : ""}`}
                onClick={() => setForm(f => ({ ...f, category: label }))}
              >
                <span className="addtx__cat-icon">{icon}</span>
                <span className="addtx__cat-label">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          className={`addtx__submit addtx__submit--${form.type}`}
          onClick={handleSubmit}
        >
          {form.type === "income" ? "Add income" : "Add expense"}
        </button>

        {success && (
          <div className="addtx__success">
            ✓ Transaction added successfully!
          </div>
        )}
      </div>
    </div>
  );
}
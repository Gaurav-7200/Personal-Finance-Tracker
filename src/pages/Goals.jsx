import { useState } from "react";
import "./Goals.css";

const SAMPLE_GOALS = [
  { id: 1, name: "Emergency fund", target: 50000, saved: 18000, icon: "🛡️" },
  { id: 2, name: "New laptop",     target: 80000, saved: 32000, icon: "💻" },
  { id: 3, name: "Vacation",       target: 25000, saved: 8500,  icon: "✈️" },
];

function GoalCard({ goal, onUpdate }) {
  const pct = Math.min((goal.saved / goal.target) * 100, 100);
  const remaining = Math.max(goal.target - goal.saved, 0);
  const done = pct >= 100;

  return (
    <div className={`goal-card${done ? " goal-card--done" : ""}`}>
      <div className="goal-card__top">
        <span className="goal-card__icon">{goal.icon}</span>
        <div className="goal-card__info">
          <span className="goal-card__name">{goal.name}</span>
          <span className="goal-card__sub">
            {done ? "Goal reached! 🎉" : `₹${remaining.toLocaleString("en-IN")} remaining`}
          </span>
        </div>
        <span className="goal-card__pct">{Math.round(pct)}%</span>
      </div>
      <div className="goal-card__track">
        <div className="goal-card__bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="goal-card__amounts">
        <span className="goal-card__saved">Saved ₹{goal.saved.toLocaleString("en-IN")}</span>
        <span className="goal-card__target">Goal ₹{goal.target.toLocaleString("en-IN")}</span>
      </div>
      {!done && (
        <button className="goal-card__add-btn" onClick={() => onUpdate(goal.id)}>
          + Add savings
        </button>
      )}
    </div>
  );
}

export default function Goals() {
  const [goals, setGoals]     = useState(SAMPLE_GOALS);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: "", icon: "🎯" });

  function handleUpdate(id) {
    const amt = parseFloat(prompt("How much are you adding?") || 0);
    if (!isNaN(amt) && amt > 0) {
      setGoals(g => g.map(goal =>
        goal.id === id ? { ...goal, saved: Math.min(goal.saved + amt, goal.target) } : goal
      ));
    }
  }

  function handleAdd() {
    const t = parseFloat(newGoal.target);
    if (!newGoal.name || isNaN(t) || t <= 0) return;
    setGoals(g => [...g, { id: Date.now(), name: newGoal.name, target: t, saved: 0, icon: newGoal.icon }]);
    setNewGoal({ name: "", target: "", icon: "🎯" });
    setShowForm(false);
  }

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved  = goals.reduce((s, g) => s + g.saved, 0);
  const overallPct  = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="goals">
      <header className="goals__header">
        <div>
          <h1 className="goals__title">Goals</h1>
          <p className="goals__subtitle">Track your savings targets</p>
        </div>
        <button className="goals__new-btn" onClick={() => setShowForm(v => !v)}>
          {showForm ? "Cancel" : "+ New goal"}
        </button>
      </header>

      <div className="goals__summary">
        <span className="goals__summary-label">Overall progress</span>
        <span className="goals__summary-pct">{overallPct}%</span>
        <div className="goals__summary-track">
          <div className="goals__summary-bar" style={{ width: `${overallPct}%` }} />
        </div>
        <span className="goals__summary-sub">
          ₹{totalSaved.toLocaleString("en-IN")} of ₹{totalTarget.toLocaleString("en-IN")}
        </span>
      </div>

      {showForm && (
        <div className="goals__form">
          <input
            placeholder="Goal name…"
            value={newGoal.name}
            onChange={e => setNewGoal(g => ({ ...g, name: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Target amount (₹)"
            value={newGoal.target}
            onChange={e => setNewGoal(g => ({ ...g, target: e.target.value }))}
          />
          <input
            placeholder="Icon (emoji)"
            value={newGoal.icon}
            maxLength={2}
            onChange={e => setNewGoal(g => ({ ...g, icon: e.target.value }))}
            style={{ width: "80px" }}
          />
          <button className="goals__form-submit" onClick={handleAdd}>Add goal</button>
        </div>
      )}

      <div className="goals__grid">
        {goals.map(g => (
          <GoalCard key={g.id} goal={g} onUpdate={handleUpdate} />
        ))}
      </div>
    </div>
  );
}
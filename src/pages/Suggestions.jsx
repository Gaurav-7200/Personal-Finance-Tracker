import { useMemo } from "react";
import "./Suggestions.css";

function generateSuggestions(transactions) {
  if (transactions.length === 0) return [];

  const income  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const ratio   = income > 0 ? expense / income : 0;

  const catMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });

  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
  const suggestions = [];

  if (ratio > 0.8) {
    suggestions.push({
      type: "danger",
      icon: "🚨",
      title: "High expense ratio",
      body: `You're spending ${Math.round(ratio * 100)}% of your income. Try to bring this below 60%.`,
      tip: "Review your top expense categories and set a monthly cap.",
    });
  } else if (ratio > 0.5) {
    suggestions.push({
      type: "warning",
      icon: "⚠️",
      title: "Watch your spending",
      body: `${Math.round(ratio * 100)}% of income is going out. A healthy target is under 50%.`,
      tip: "Consider a 50/30/20 budget: needs, wants, savings.",
    });
  } else if (ratio > 0) {
    suggestions.push({
      type: "good",
      icon: "✦",
      title: "Great spending balance",
      body: `Only ${Math.round(ratio * 100)}% of income spent. You're doing well!`,
      tip: "Consider putting your surplus into a savings goal.",
    });
  }

  if (topCat) {
    suggestions.push({
      type: "info",
      icon: "📊",
      title: `Top spend: ${topCat[0]}`,
      body: `You've spent ₹${topCat[1].toLocaleString("en-IN")} on ${topCat[0]} — your largest category.`,
      tip: `Look for ways to reduce ${topCat[0]} costs by 10–15%.`,
    });
  }

  if (income > 0) {
    const savingsRate = Math.round((1 - ratio) * 100);
    suggestions.push({
      type: "info",
      icon: "💡",
      title: "Savings rate",
      body: `You're saving about ${savingsRate}% of your income right now.`,
      tip: savingsRate < 20
        ? "Aim for at least 20% savings rate for long-term financial health."
        : "Excellent! A 20%+ savings rate puts you ahead of most people.",
    });
  }

  suggestions.push({
    type: "neutral",
    icon: "🎯",
    title: "Set a savings goal",
    body: "Having a specific target makes saving 2× more effective.",
    tip: "Head to Goals to create your first savings milestone.",
  });

  return suggestions;
}

export default function Suggestions({ transactions = [] }) {
  const suggestions = useMemo(() => generateSuggestions(transactions), [transactions]);

  return (
    <div className="sugg">
      <h1 className="sugg__title">Suggestions</h1>
      <p className="sugg__subtitle">Personalised insights based on your data</p>

      {suggestions.length === 0 ? (
        <div className="sugg__empty">
          <span>✦</span>
          <p>Add transactions to unlock personalised suggestions.</p>
        </div>
      ) : (
        <div className="sugg__list">
          {suggestions.map((s, i) => (
            <div className={`sugg__card sugg__card--${s.type}`} key={i}>
              <div className="sugg__card-top">
                <span className="sugg__card-icon">{s.icon}</span>
                <div>
                  <h2 className="sugg__card-title">{s.title}</h2>
                  <p className="sugg__card-body">{s.body}</p>
                </div>
              </div>
              <div className="sugg__card-tip">
                <span className="sugg__tip-label">Tip</span>
                <span className="sugg__tip-text">{s.tip}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
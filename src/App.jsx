import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar          from "./components/Navbar";
import Dashboard       from "./pages/Dashboard";
import AddTransaction  from "./pages/AddTransaction";
import Transactions    from "./pages/Transactions";
import Activity        from "./pages/Activity";
import Goals           from "./pages/Goals";
import Suggestions     from "./pages/Suggestions";

export default function App() {
  const [transactions, setTransactions] = useState([]);

  function addTransaction(tx) {
    setTransactions(prev => [...prev, tx]);
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/"             element={<Dashboard     transactions={transactions} onDelete={deleteTransaction} />} />
            <Route path="/add"          element={<AddTransaction onAdd={addTransaction} />} />
            <Route path="/transactions" element={<Transactions  transactions={transactions} onDelete={deleteTransaction} />} />
            <Route path="/activity"     element={<Activity      transactions={transactions} />} />
            <Route path="/goals"        element={<Goals />} />
            <Route path="/suggestions"  element={<Suggestions   transactions={transactions} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
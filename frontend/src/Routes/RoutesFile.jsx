import React from "react";
import { Routes, Route } from "react-router-dom";
import IncomeDashboard from "../Income/IncomeDashboard";
import ExpenseDashboard from "../Expense/ExpenseDashboard";

export default function RoutesFile() {
  return (
    <Routes>
      <Route path="/income" element={<IncomeDashboard />} />
      <Route path="/expense" element={<ExpenseDashboard />} />
    </Routes>
  );
}

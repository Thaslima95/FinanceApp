import React from "react";
import { Routes, Route } from "react-router-dom";
import IncomeDashboard from "../Income/IncomeDashboard";
import ExpenseDashboard from "../Expense/ExpenseDashboard";
import Income2 from "../Income/Income2";

export default function RoutesFile() {
  return (
    <Routes>
      <Route path="/income" element={<IncomeDashboard />} />
      <Route path="/expense" element={<ExpenseDashboard />} />
      <Route path="/income2" element={<Income2 />} />
    </Routes>
  );
}

import React from "react";
import axios from "axios";

export default {
  addIncome: async function (newRow) {
    try {
      const response = await axios.post(`/addincome`, newRow);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  updateIncome: async function (id, newRow) {
    try {
      const response = await axios.put(`/updateincome/${id}`, newRow);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  getTotalIncome: async function () {
    try {
      const response = await axios.get(`/getTotalIncomeRate`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  getUnpaidTotalIncome: async function () {
    try {
      const response = await axios.get(`getUnpaidTotalIncomeRate`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  getTotalExpense: async function () {
    try {
      const response = await axios.get(`/getTotalExpenseRate`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  getUnpaidTotalExpense: async function () {
    try {
      const response = await axios.get(`/getTotalUnpaidExpenseRate`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  addExpense: async function (newRow) {
    try {
      const response = await axios.post(`/addexpense`, newRow);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  updateExpense: async function (id, newRow) {
    try {
      const response = await axios.put(`/updateexpense/${id}`, newRow);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
};

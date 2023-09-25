import React from "react";
import axios from "axios";

export default {
  getTotalIncome: async function () {
    try {
      console.log("total income");
      const response = await axios.get(`/getTotalIncomeRate`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
};

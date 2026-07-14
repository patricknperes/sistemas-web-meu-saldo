import { api } from "./api.js";

async function getSummary() {
  const response = await api.get("/dashboard/summary");

  return response.data;
}

async function getHistory(year) {
  const response = await api.get(
    "/dashboard/history",
    {
      params: year
        ? { year }
        : {},
    }
  );

  return response.data;
}

export const dashboardService = {
  getSummary,
  getHistory,
};
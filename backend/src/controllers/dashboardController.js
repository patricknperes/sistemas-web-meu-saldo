import {
  getDashboardSummary,
  getMonthlyHistory,
} from "../services/dashboardService.js";

export async function dashboardSummaryController(
  req,
  res
) {
  const summary = await getDashboardSummary(
    req.user.id
  );

  return res.status(200).json({
    summary,
  });
}

export async function monthlyHistoryController(
  req,
  res
) {
  const history = await getMonthlyHistory(
    req.user.id,
    req.query.year
  );

  return res.status(200).json({
    history,
  });
}
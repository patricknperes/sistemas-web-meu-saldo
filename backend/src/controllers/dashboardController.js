import {
  getDashboardSummary,
  getHistoryAnalytics,
  getMonthlyHistory,
} from "../services/dashboardService.js";

export async function dashboardSummaryController(
  req,
  res
) {
  const summary =
    await getDashboardSummary(
      req.user.id,
      {
        month: req.query.month,
        year: req.query.year,
      }
    );

  return res.status(200).json({
    summary,
  });
}

export async function monthlyHistoryController(
  req,
  res
) {
  const history =
    await getMonthlyHistory(
      req.user.id,
      req.query.year
    );

  return res.status(200).json({
    history,
  });
}

export async function historyAnalyticsController(
  req,
  res
) {
  const analytics =
    await getHistoryAnalytics(
      req.user.id,
      req.query
    );

  return res.status(200).json({
    analytics,
  });
}

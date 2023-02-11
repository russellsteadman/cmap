export const logUserEvent = (
  type:
    | "grade_click"
    | "consent_reject"
    | "consent_accept"
    | "grade_success"
    | "grade_failure",
  message?: string
) => {
  try {
    gtag("event", "interaction", {
      interaction_type: type,
      message,
    });
  } catch (error) {
    console.error("Unable to log event to Google Analytics", error);
  }
};

export const logSummaryStats = (nc: number, hh: number) => {
  try {
    gtag("event", "summary_stats", {
      number_concepts: nc,
      highest_hierarchy: hh,
    });
  } catch (error) {
    console.error("Unable to log event to Google Analytics", error);
  }
};

import React from "react";
import StatsCard from "./StatsCard";

const StatsSummary = React.memo(function StatsSummary({ bestWpm, bestAccuracy, testsCount }) {
  return (
    <div className="flex gap-6 mb-8">
      <StatsCard label="Best WPM" value={bestWpm} />
      <StatsCard label="Best Accuracy" value={`${bestAccuracy}%`} />
      <StatsCard label="Tests Taken" value={testsCount} />
    </div>
  );
});

export default StatsSummary;

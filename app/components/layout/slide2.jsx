"use client";

import MandaysSummary from "./mandayssummary";
import TrainingAnalytics from "./traininganalytics";

export default function Slide2({ filters }) {
  return (
    <section className="w-full min-h-screen px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-1">
          <MandaysSummary filters={filters} />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">
          <TrainingAnalytics filters={filters} />
        </div>
      </div>
    </section>
  );
}

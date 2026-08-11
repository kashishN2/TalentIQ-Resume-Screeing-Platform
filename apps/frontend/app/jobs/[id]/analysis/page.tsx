"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getJobAnalysis } from "../../../../lib/api";
import { getToken } from "../../../../lib/auth";
import type {
  CandidateAnalysis,
  JobAnalysis,
} from "../../../../lib/types";
export default function JobAnalysisPage() {
  const router = useRouter();
  const params = useParams();

  const jobId = params.id as string;

  const [analysis, setAnalysis] =
    useState<JobAnalysis | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalysis() {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await getJobAnalysis(
          token,
          jobId,
        );

        setAnalysis(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load candidate analysis.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      loadAnalysis();
    }
  }, [jobId, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading candidate analysis...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 lg:p-10">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => router.push(`/jobs/${jobId}`)}
            className="mb-6 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Job
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-10">
          <button
            onClick={() => router.push(`/jobs/${jobId}`)}
            className="mb-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Job
          </button>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-950">
                Candidate Analysis
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                AI-powered screening and candidate ranking
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 px-5 py-3">
              <p className="text-xs font-medium text-indigo-600">
                Candidates Analyzed
              </p>

              <p className="mt-1 text-2xl font-bold text-indigo-950">
                {analysis.total_analyzed}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-6 lg:p-10">
        {analysis.candidates.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-4xl">📊</div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No analyzed candidates
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              No candidates were successfully analyzed for this job.
            </p>
          </div>
        ) : (
          <>
            <section className="grid gap-5 md:grid-cols-3">
              <SummaryCard
                label="Candidates"
                value={analysis.total_analyzed}
              />

              <SummaryCard
                label="Shortlisted"
                value={
                  analysis.candidates.filter(
                    (candidate: CandidateAnalysis) =>
                      candidate.recommendation === "SHORTLIST",
                  ).length
                }
              />

              <SummaryCard
                label="Average Score"
                value={`${Math.round(
                  analysis.candidates.reduce(
                    (sum: number, candidate: CandidateAnalysis) =>
                      sum + candidate.overall_score,
                    0,
                  ) / analysis.candidates.length,
                )}%`}
              />
            </section>

            <section className="mt-8">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-950">
                  Candidate Ranking
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Candidates ranked by overall screening score.
                </p>
              </div>

              <div className="space-y-4">
                {analysis.candidates.map((candidate: CandidateAnalysis) => (
                  <CandidateCard
                    key={candidate.resume_id}
                    candidate={candidate}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-950">
        {value}
      </p>
    </div>
  );
}

function CandidateCard({
  candidate,
}: {
  candidate: CandidateAnalysis;
}) {
  const recommendation =
    candidate.recommendation;

  let recommendationClass =
    "bg-amber-50 text-amber-700";

  if (recommendation === "SHORTLIST") {
    recommendationClass =
      "bg-emerald-50 text-emerald-700";
  }

  if (recommendation === "REJECT") {
    recommendationClass =
      "bg-red-50 text-red-700";
  }

  return (
    <article className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-700">
              #{candidate.rank}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-950">
                {candidate.candidate_name}
              </h3>

              {candidate.email && (
                <p className="mt-1 text-sm text-gray-500">
                  {candidate.email}
                </p>
              )}

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${recommendationClass}`}
              >
                {recommendation}
              </span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs font-medium text-gray-500">
              Overall Score
            </p>

            <p className="mt-1 text-4xl font-bold text-indigo-600">
              {Math.round(candidate.overall_score)}
            </p>

            <p className="text-xs text-gray-500">
              Confidence {Math.round(candidate.confidence)}%
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <ScoreBox
            label="ATS Score"
            value={candidate.ats_score}
          />

          <ScoreBox
            label="AI Score"
            value={candidate.ai_score}
          />

          <ScoreBox
            label="Overall"
            value={candidate.overall_score}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SkillList
            title="Matched Skills"
            skills={candidate.matched_skills}
            positive={true}
          />

          <SkillList
            title="Missing Skills"
            skills={candidate.missing_skills}
            positive={false}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <BulletList
            title="Strengths"
            items={candidate.strengths}
            icon="✓"
          />

          <BulletList
            title="Weaknesses"
            items={candidate.weaknesses}
            icon="!"
          />
        </div>

        {candidate.recruiter_summary && (
          <div className="mt-6 rounded-xl bg-gray-50 p-5">
            <h4 className="text-sm font-semibold text-gray-900">
              Recruiter Summary
            </h4>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {candidate.recruiter_summary}
            </p>
          </div>
        )}

        {candidate.evidence.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900">
              Skill Evidence
            </h4>

            <div className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-100">
              {candidate.evidence.map((item, index) => (
                <div
                  key={`${item.skill}-${index}`}
                  className="p-4"
                >
                  <p className="text-sm font-semibold text-indigo-700">
                    {item.skill}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {item.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function ScoreBox({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-gray-900">
        {Math.round(value)}
      </p>
    </div>
  );
}

function SkillList({
  title,
  skills,
  positive,
}: {
  title: string;
  skills: string[];
  positive: boolean;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900">
        {title}
      </h4>

      {skills.length === 0 ? (
        <p className="mt-2 text-sm text-gray-400">
          None
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className={
                positive
                  ? "rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                  : "rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
              }
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function BulletList({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: string;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900">
        {title}
      </h4>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-400">
          None
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="flex gap-2 text-sm leading-6 text-gray-600"
            >
              <span className="font-bold text-indigo-600">
                {icon}
              </span>

              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
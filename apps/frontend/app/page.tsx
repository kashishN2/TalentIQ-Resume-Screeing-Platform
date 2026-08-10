
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getJobs } from "../lib/api";
import { getToken, removeToken } from "../lib/auth";
import type { Job } from "../lib/types";

export default function Home() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await getJobs(token);
        setJobs(response.jobs);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load jobs.";

        if (
          message.toLowerCase().includes("not authenticated") ||
          message.includes("401")
        ) {
          removeToken();
          router.replace("/login");
          return;
        }

        setJobsError(message);
      } finally {
        setCheckingAuth(false);
        setJobsLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">
            Loading TalentIQ...
          </p>
        </div>
      </main>
    );
  }

  const activeJobs = jobs.filter(
    (job) => job.status === "OPEN"
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status === "CLOSED"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">

          {/* Logo */}
          <div className="border-b border-gray-100 px-6 py-6">
            <h2 className="text-xl font-bold text-gray-950">
              TalentIQ
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Candidate Intelligence
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">

            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </p>

            <div className="space-y-1">
              <NavItem
                active
                label="Dashboard"
                icon="⌂"
                onClick={() => router.push("/")}
              />

              <NavItem
                label="Jobs"
                icon="▣"
                onClick={() => router.push("/jobs")}
              />

              <NavItem
                label="Candidates"
                icon="♙"
                onClick={() => router.push("/candidates")}
              />

              <NavItem
                label="Analytics"
                icon="◫"
                onClick={() => router.push("/analytics")}
              />
            </div>

            <p className="mt-8 px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Management
            </p>

            <div className="space-y-1">
              <NavItem
                label="Email Decisions"
                icon="✉"
                onClick={() => router.push("/emails")}
              />

              <NavItem
                label="Settings"
                icon="⚙"
                onClick={() => router.push("/settings")}
              />
            </div>
          </nav>

          {/* User */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                KN
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  Kashish
                </p>

                <p className="truncate text-xs text-gray-500">
                  Administrator
                </p>
              </div>

            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1">

          {/* Header */}
          <header className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between px-6 py-5 lg:px-10">

              <div>
                <p className="text-sm text-gray-500">
                  TalentIQ Workspace
                </p>

                <h1 className="mt-1 text-2xl font-bold text-gray-950">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage jobs and screen candidates.
                </p>
              </div>

              <header className="border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between px-6 py-5 lg:px-10">
                  <div>
                    <p className="text-sm text-gray-500">
                      Monday, August 10, 2026
                    </p>
              
                    <h1 className="mt-1 text-2xl font-bold text-gray-950">
                      Good morning, Kashish
                    </h1>
                  </div>
                </div>
              </header>

            </div>
          </header>

          <div className="p-6 lg:p-10">

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                label="Active Jobs"
                value={jobsLoading ? "..." : String(activeJobs)}
                description="Currently open"
              />

              <StatCard
                label="Total Jobs"
                value={jobsLoading ? "..." : String(jobs.length)}
                description="In your workspace"
              />

              <StatCard
                label="Closed Jobs"
                value={jobsLoading ? "..." : String(closedJobs)}
                description="Completed roles"
              />

              <StatCard
                label="Candidates"
                value="—"
                description="Available after resume analysis"
              />

            </section>

            {/* Dashboard content */}
            <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

              {/* Recent Jobs */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                  <div>
                    <h2 className="font-semibold text-gray-950">
                      Recent Jobs
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Jobs from your recruitment workspace
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/jobs")}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    View all
                  </button>

                </div>

                {/* Loading */}
                {jobsLoading && (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />

                    <p className="mt-4 text-sm text-gray-500">
                      Loading jobs...
                    </p>
                  </div>
                )}

                {/* Error */}
                {!jobsLoading && jobsError && (
                  <div className="px-6 py-6">

                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">

                      <p className="text-sm font-semibold text-red-800">
                        Unable to load jobs
                      </p>

                      <p className="mt-1 text-sm text-red-700">
                        {jobsError}
                      </p>

                      <button
                        onClick={() => window.location.reload()}
                        className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Try again
                      </button>

                    </div>

                  </div>
                )}

                {/* Empty state */}
                {!jobsLoading &&
                  !jobsError &&
                  jobs.length === 0 && (
                    <div className="px-6 py-12 text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600">
                        +
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-gray-900">
                        No jobs yet
                      </h3>

                      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                        Create your first job to start building your recruitment pipeline.
                      </p>

                      <button
                        onClick={() => router.push("/jobs/new")}
                        className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                      >
                        Create your first job
                      </button>

                    </div>
                  )}

                {/* Jobs */}
                {!jobsLoading &&
                  !jobsError &&
                  jobs.length > 0 && (
                    <div className="divide-y divide-gray-100">

                      {jobs.slice(0, 5).map((job) => (
                        <JobRow
                          key={job.id}
                          job={job}
                          onClick={() =>
                            router.push(`/jobs/${job.id}`)
                          }
                        />
                      ))}

                    </div>
                  )}

              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <h2 className="font-semibold text-gray-950">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Start your recruitment workflow
                </p>

                <div className="mt-6 space-y-3">

                  <ActionButton
                    title="Create a new job"
                    description="Define role requirements"
                    onClick={() => router.push("/jobs/new")}
                  />

                  <ActionButton
                    title="View all jobs"
                    description="Manage your recruitment roles"
                    onClick={() => router.push("/jobs")}
                  />

                  <ActionButton
                    title="Review candidates"
                    description="Inspect ranked candidates"
                    onClick={() => router.push("/candidates")}
                  />

                </div>

                {/* AI Status */}
                <div className="mt-6 rounded-xl bg-indigo-50 p-4">

                  <div className="flex items-center gap-2">

                    <div className="h-2 w-2 rounded-full bg-emerald-500" />

                    <p className="text-sm font-semibold text-indigo-900">
                      Screening System Ready
                    </p>

                  </div>

                  <p className="mt-1 text-xs leading-5 text-indigo-700">
                    Upload resumes for a job to begin candidate screening and analysis.
                  </p>

                </div>

              </div>

            </section>

          </div>
        </section>
      </div>
    </main>
  );
}

/* ================================
   Stat Card
================================ */

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-gray-950">
        {value}
      </p>

      <p className="mt-2 text-xs font-medium text-gray-400">
        {description}
      </p>

    </div>
  );
}

/* ================================
   Job Row
================================ */

function JobRow({
  job,
  onClick,
}: {
  job: Job;
  onClick: () => void;
}) {
  const initials = job.title
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const experience =
    job.experience_min === job.experience_max
      ? `${job.experience_min} years`
      : `${job.experience_min}–${job.experience_max} years`;

  return (
    <div className="px-6 py-5">

      <div className="flex items-center justify-between gap-5">

        {/* Job information */}
        <div className="flex min-w-0 items-center gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
            {initials}
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-gray-900">
              {job.title}
            </p>

            <p className="mt-1 truncate text-xs text-gray-500">
              {job.department} · {job.location}
            </p>

          </div>

        </div>

        {/* Status + View */}
        <div className="flex shrink-0 items-center gap-4">

          <span
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
              job.status === "OPEN"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {job.status}
          </span>

          <button
            onClick={onClick}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View →
          </button>

        </div>

      </div>

      {/* Job metadata */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-4">

        <JobMeta
          label="Employment"
          value={job.employment_type}
        />

        <JobMeta
          label="Experience"
          value={experience}
        />

        <JobMeta
          label="Minimum Score"
          value={String(job.minimum_score)}
        />

        <JobMeta
          label="Required Skills"
          value={`${job.required_skills.length} skills`}
        />

      </div>

    </div>
  );
}

/* ================================
   Job Metadata
================================ */

function JobMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-gray-700">
        {value}
      </p>

    </div>
  );
}

/* ================================
   Sidebar Navigation
================================ */

function NavItem({
  label,
  icon,
  active = false,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
      }`}
    >
      <span className="w-5 text-center">
        {icon}
      </span>

      {label}
    </button>
  );
}

/* ================================
   Quick Action
================================ */

function ActionButton({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-left transition hover:border-indigo-100 hover:bg-indigo-50"
    >

      <div>

        <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>

      </div>

      <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600">
        →
      </span>

    </button>
  );
}


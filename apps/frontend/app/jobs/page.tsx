"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getJobs } from "../../lib/api";
import { getToken } from "../../lib/auth";
import type { Job } from "../../lib/types";

export default function JobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await getJobs(token);
        setJobs(response.jobs);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load jobs.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [router]);

  function formatExperience(job: Job) {
    if (
      job.experience_min === 0 &&
      job.experience_max === 0
    ) {
      return "Fresher";
    }

    if (job.experience_min === job.experience_max) {
      return `${job.experience_min} years`;
    }

    return `${job.experience_min}–${job.experience_max} years`;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-gray-100 px-6 py-6">
            <button
              onClick={() => router.push("/")}
              className="text-left"
            >
              <h2 className="text-xl font-bold text-gray-950">
                TalentIQ
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Candidate Intelligence
              </p>
            </button>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </p>

            <div className="space-y-1">
              <NavItem
                label="Dashboard"
                icon="⌂"
                onClick={() => router.push("/")}
              />

              <NavItem
                active
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

        {/* Main content */}
        <section className="flex-1">
          {/* Header */}
          <header className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between px-6 py-5 lg:px-10">
              <div>
                <button
                  onClick={() => router.push("/")}
                  className="mb-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  ← Dashboard
                </button>

                <h1 className="text-2xl font-bold text-gray-950">
                  Jobs
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your recruitment roles and
                  requirements.
                </p>
              </div>

              <button
                onClick={() => router.push("/jobs/new")}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                + Create Job
              </button>
            </div>
          </header>

          <div className="p-6 lg:p-10">
            {/* Page intro */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  Your Jobs
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {loading
                    ? "Loading jobs..."
                    : `${jobs.length} job${
                        jobs.length === 1 ? "" : "s"
                      } in your workspace`}
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading jobs...
                </p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && jobs.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600">
                  +
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-950">
                  No jobs yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  Create your first job to define the role
                  requirements and start screening candidates.
                </p>

                <button
                  onClick={() => router.push("/jobs/new")}
                  className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Create your first job
                </button>
              </div>
            )}

            {/* Job list */}
            {!loading && !error && jobs.length > 0 && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      {/* Job information */}
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                          {job.title
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-950">
                              {job.title}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                                job.status === "OPEN"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-gray-500">
                            {job.department} · {job.location}
                          </p>
                        </div>
                      </div>

                      {/* Open button */}
                      <button
                        onClick={() =>
                          router.push(`/jobs/${job.id}`)
                        }
                        className="shrink-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        View Job →
                      </button>
                    </div>

                    {/* Job metadata */}
                    <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                      <JobMeta
                        label="Employment"
                        value={job.employment_type}
                      />

                      <JobMeta
                        label="Experience"
                        value={formatExperience(job)}
                      />

                      <JobMeta
                        label="Minimum Score"
                        value={`${job.minimum_score}`}
                      />

                      <JobMeta
                        label="Required Skills"
                        value={`${job.required_skills.length} skills`}
                      />
                    </div>

                    {/* Skills */}
                    {job.required_skills.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Required Skills
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {job.required_skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {job.description && (
                      <div className="mt-5">
                        <p className="line-clamp-2 text-sm leading-6 text-gray-500">
                          {job.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

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
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
      }`}
    >
      <span className="w-5 text-center">{icon}</span>
      {label}
    </button>
  );
}

function JobMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
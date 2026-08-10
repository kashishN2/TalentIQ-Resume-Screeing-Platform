"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createJob } from "../../../lib/api";
import { getToken } from "../../../lib/auth";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [experienceMin, setExperienceMin] = useState("0");
  const [experienceMax, setExperienceMax] = useState("2");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [minimumScore, setMinimumScore] = useState("60");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const requiredSkills = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (requiredSkills.length === 0) {
      setError("Please add at least one required skill.");
      return;
    }

    if (Number(experienceMin) > Number(experienceMax)) {
      setError(
        "Minimum experience cannot be greater than maximum experience.",
      );
      return;
    }

    setLoading(true);

    try {
      await createJob(
        token,
        {
          title: title.trim(),
          department: department.trim(),
          location: location.trim(),
          employment_type: employmentType,
          experience_min: Number(experienceMin),
          experience_max: Number(experienceMax),
          description: description.trim(),
          required_skills: requiredSkills,
          minimum_score: Number(minimumScore),
        },
      );

      router.push("/jobs");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create job.",
      );
    } finally {
      setLoading(false);
    }
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
          <header className="border-b border-gray-200 bg-white">
            <div className="px-6 py-5 lg:px-10">
              <button
                onClick={() => router.push("/jobs")}
                className="mb-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                ← Back to Jobs
              </button>

              <h1 className="text-2xl font-bold text-gray-950">
                Create Job
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Define the role requirements for candidate
                screening.
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-4xl p-6 lg:p-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Basic information */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-950">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Tell us about the position.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Job Title"
                    required
                  >
                    <input
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value)
                      }
                      placeholder="e.g. Software Development Engineer"
                      required
                      className="input"
                    />
                  </Field>

                  <Field
                    label="Department"
                    required
                  >
                    <input
                      type="text"
                      value={department}
                      onChange={(event) =>
                        setDepartment(event.target.value)
                      }
                      placeholder="e.g. Engineering"
                      required
                      className="input"
                    />
                  </Field>

                  <Field
                    label="Location"
                    required
                  >
                    <input
                      type="text"
                      value={location}
                      onChange={(event) =>
                        setLocation(event.target.value)
                      }
                      placeholder="e.g. Gurugram, Haryana"
                      required
                      className="input"
                    />
                  </Field>

                  <Field
                    label="Employment Type"
                    required
                  >
                    <select
                      value={employmentType}
                      onChange={(event) =>
                        setEmploymentType(event.target.value)
                      }
                      className="input"
                    >
                      <option value="Full-time">
                        Full-time
                      </option>
                      <option value="Part-time">
                        Part-time
                      </option>
                      <option value="Contract">
                        Contract
                      </option>
                      <option value="Internship">
                        Internship
                      </option>
                    </select>
                  </Field>
                </div>
              </section>

              {/* Experience */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-950">
                    Experience Requirements
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Specify the expected experience range.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Minimum Experience"
                    required
                  >
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={experienceMin}
                        onChange={(event) =>
                          setExperienceMin(event.target.value)
                        }
                        required
                        className="input pr-20"
                      />

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        years
                      </span>
                    </div>
                  </Field>

                  <Field
                    label="Maximum Experience"
                    required
                  >
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={experienceMax}
                        onChange={(event) =>
                          setExperienceMax(event.target.value)
                        }
                        required
                        className="input pr-20"
                      />

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        years
                      </span>
                    </div>
                  </Field>
                </div>
              </section>

              {/* Description */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-950">
                    Job Description
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Describe responsibilities, qualifications,
                    and expectations.
                  </p>
                </div>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the role, responsibilities, qualifications, technologies, and other expectations..."
                  rows={8}
                  required
                  className="input resize-none"
                />
              </section>

              {/* Skills */}
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-950">
                    Screening Requirements
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    These requirements will be used during
                    candidate screening.
                  </p>
                </div>

                <div className="space-y-5">
                  <Field
                    label="Required Skills"
                    required
                  >
                    <input
                      type="text"
                      value={skills}
                      onChange={(event) =>
                        setSkills(event.target.value)
                      }
                      placeholder="Python, React, SQL, FastAPI, Docker"
                      required
                      className="input"
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      Separate multiple skills with commas.
                    </p>
                  </Field>

                  <Field
                    label="Minimum Screening Score"
                    required
                  >
                    <div className="relative max-w-xs">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={minimumScore}
                        onChange={(event) =>
                          setMinimumScore(event.target.value)
                        }
                        required
                        className="input pr-12"
                      />

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        %
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Candidates below this score can be
                      filtered during screening.
                    </p>
                  </Field>
                </div>
              </section>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/jobs")}
                  disabled={loading}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating Job..."
                    : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
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
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
analyzeJob,
deleteJob,
getJob,
getResumes,
uploadResumes,
} from "../../../lib/api";

import { getToken } from "../../../lib/auth";
import type { Job, Resume } from "../../../lib/types";

export default function JobDetailsPage() {
const router = useRouter();
const params = useParams();

const jobId = params.id as string;

const [job, setJob] = useState<Job | null>(null);
const [resumes, setResumes] = useState<Resume[]>([]);

const [loading, setLoading] = useState(true);
const [uploading, setUploading] = useState(false);
const [analyzing, setAnalyzing] = useState(false);
const [deleting, setDeleting] = useState(false);
const [error, setError] = useState("");
const [uploadMessage, setUploadMessage] = useState("");
const [analysisMessage, setAnalysisMessage] = useState("");

useEffect(() => {
async function loadJob() {
const token = getToken();

  if (!token) {
    router.replace("/login");
    return;
  }

  try {
    const [jobResponse, resumeResponse] = await Promise.all([
      getJob(token, jobId),
      getResumes(token, jobId),
    ]);

    setJob(jobResponse);
    setResumes(resumeResponse.resumes);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to load job details.",
    );
  } finally {
    setLoading(false);
  }
}

if (jobId) {
  loadJob();
}


}, [jobId, router]);

async function handleUpload(
event: ChangeEvent<HTMLInputElement>,
) {
const file = event.target.files?.[0];


if (!file) {
  return;
}

if (!file.name.toLowerCase().endsWith(".zip")) {
  setError("Please upload a ZIP file containing the resumes.");
  event.target.value = "";
  return;
}

const token = getToken();

if (!token) {
  router.replace("/login");
  return;
}

setUploading(true);
setUploadMessage("");
setAnalysisMessage("");
setError("");

try {
  const response = await uploadResumes(
    token,
    jobId,
    file,
  );

  const successMessage =
    response.message ||
    `${response.uploaded} resume(s) uploaded successfully.`;

  setUploadMessage(successMessage);

  const updatedResumes = await getResumes(
    token,
    jobId,
  );

  setResumes(updatedResumes.resumes);
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Unable to upload resumes.",
  );
} finally {
  setUploading(false);
  event.target.value = "";
}


}

async function handleAnalyze() {
const token = getToken();


if (!token) {
  router.replace("/login");
  return;
}

if (resumes.length === 0) {
  setError("Upload at least one resume before analysis.");
  return;
}

setAnalyzing(true);
setError("");
setAnalysisMessage("");

try {
  const response = await analyzeJob(token, jobId);

  setAnalysisMessage(
    typeof response === "string"
      ? response
      : "Candidate analysis completed successfully.",
  );

  router.push(`/jobs/${jobId}/analysis`);
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Unable to analyze candidates.",
  );
} finally {
  setAnalyzing(false);
}


}


async function handleDelete() {
  const confirmed = window.confirm(
    "Are you sure you want to delete this job?\n\n" +
      "This will permanently delete the job and all uploaded resumes.\n\n" +
      "This action cannot be undone.",
  );

  if (!confirmed) {
    return;
  }

  const token = getToken();

  if (!token) {
    router.replace("/login");
    return;
  }

  setDeleting(true);
  setError("");

  try {
    await deleteJob(token, jobId);

    router.push("/jobs");
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to delete the job.",
    );
    setDeleting(false);
  }
}

function openUploadDialog() {
if (uploading) {
return;
}


document.getElementById("resume-upload")?.click();


}

if (loading) {
return ( <main className="flex min-h-screen items-center justify-center bg-gray-50"> <p className="text-sm text-gray-500">
Loading job... </p> </main>
);
}

if (error && !job) {
return ( <main className="min-h-screen bg-gray-50 p-6 lg:p-10"> <div className="mx-auto max-w-5xl">
<button
onClick={() => router.push("/jobs")}
className="mb-6 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
>
← Back to Jobs </button>


      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        {error}
      </div>
    </div>
  </main>
);


}

if (!job) {
return null;
}

return ( <main className="min-h-screen bg-gray-50">
{/* Header */} <header className="border-b border-gray-200 bg-white"> <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
<button
onClick={() => router.push("/jobs")}
className="mb-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
>
← Back to Jobs </button>


      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-950">
              {job.title}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                job.status === "OPEN"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {job.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {job.department} · {job.location} ·{" "}
            {job.employment_type}
          </p>
        </div>

        {/* Single upload action */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={openUploadDialog}
            disabled={uploading || deleting}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading
              ? "Uploading..."
              : "Upload Resumes (ZIP)"}
          </button>
        
          <button
            onClick={handleDelete}
            disabled={deleting || uploading || analyzing}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "🗑 Delete Job"}
          </button>
        </div>
      </div>
    </div>
  </header>

  <div className="mx-auto max-w-7xl p-6 lg:p-10">
    {/* Hidden file input */}
    <input
      id="resume-upload"
      type="file"
      accept=".zip,application/zip"
      onChange={handleUpload}
      className="hidden"
    />

    {/* Error */}
    {error && (
      <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )}

    {/* Upload success */}
    {uploadMessage && (
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
        <span className="text-base">✓</span>

        <div>
          <p className="font-semibold">
            Upload completed successfully
          </p>

          <p className="mt-1">
            {uploadMessage}
          </p>
        </div>
      </div>
    )}

    {/* Analysis success */}
    {analysisMessage && (
      <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
        {analysisMessage}
      </div>
    )}

    {/* Job information */}
    <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        {/* Description */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-950">
            Job Description
          </h2>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
            {job.description}
          </p>
        </div>

        {/* Skills */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-950">
            Required Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.required_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Job summary */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-950">
            Job Requirements
          </h2>

          <div className="mt-5 space-y-5">
            <InfoRow
              label="Employment"
              value={job.employment_type}
            />

            <InfoRow
              label="Experience"
              value={`${job.experience_min}–${job.experience_max} years`}
            />

            <InfoRow
              label="Minimum Score"
              value={`${job.minimum_score}`}
            />

            <InfoRow
              label="Location"
              value={job.location}
            />
          </div>
        </div>

        {/* Resume count */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Resumes Uploaded
          </p>

          <p className="mt-2 text-4xl font-bold text-gray-950">
            {resumes.length}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Candidates available for screening
          </p>
        </div>
      </div>
    </section>

    {/* Resume section */}
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="font-semibold text-gray-950">
            Uploaded Resumes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Candidate resumes uploaded for this job
          </p>
        </div>
      </div>

      {/* Empty state */}
      {resumes.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600">
            ↑
          </div>

          <h3 className="mt-4 text-sm font-semibold text-gray-900">
            No resumes uploaded
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            Upload a ZIP file containing candidate resumes.
            You can use the Upload Resumes button above.
          </p>
        </div>
      )}

      {/* Resume list */}
      {resumes.length > 0 && (
        <div className="divide-y divide-gray-100">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm">
                  📄
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {resume.candidate_name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {resume.original_filename}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1.5 text-[11px] font-bold ${
                  resume.upload_status === "UPLOADED"
                    ? "bg-blue-50 text-blue-700"
                    : resume.upload_status === "ANALYZED"
                      ? "bg-emerald-50 text-emerald-700"
                      : resume.upload_status === "FAILED"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                }`}
              >
                {resume.upload_status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* Analysis workflow */}
    {resumes.length > 0 && (
      <section className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold text-indigo-950">
              Ready for candidate analysis?
            </h2>

            <p className="mt-1 text-sm leading-6 text-indigo-700">
              {resumes.length} candidate resume
              {resumes.length === 1 ? "" : "s"} uploaded.
              Run the screening pipeline to analyze and rank
              the candidates.
            </p>
          </div>

          <button
            onClick={async () => {
              const token = getToken();
          
              if (!token) {
                router.replace("/login");
                return;
              }
          
              try {
                setError("");
                setUploadMessage("");
          
                setUploading(true);
          
                await analyzeJob(token, jobId);
          
                router.push(`/jobs/${jobId}/analysis`);
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Unable to analyze candidates.",
                );
              } finally {
                setUploading(false);
              }
            }}
            disabled={uploading}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Analyzing..." : "Analyze Candidates"}
          </button>
        </div>
      </section>
    )}
  </div>
</main>


);
}

function InfoRow({
label,
value,
}: {
label: string;
value: string;
}) {
return ( <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"> <span className="text-sm text-gray-500">
{label} </span>


  <span className="text-right text-sm font-semibold text-gray-900">
    {value}
  </span>
</div>

);
}

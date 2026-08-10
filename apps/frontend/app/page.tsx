const stats = [
  {
    label: "Active Jobs",
    value: "12",
    change: "+3 this month",
  },
  {
    label: "Resumes Screened",
    value: "1,284",
    change: "+18.4% this month",
  },
  {
    label: "Shortlisted",
    value: "186",
    change: "14.5% of candidates",
  },
  {
    label: "Pending Review",
    value: "43",
    change: "Requires attention",
  },
];

const candidates = [
  {
    name: "Kashish Nayak",
    role: "Software Development Engineer",
    score: 97.6,
    status: "SHORTLIST",
  },
  {
    name: "Rahul Sharma",
    role: "Backend Developer",
    score: 88.4,
    status: "REVIEW",
  },
  {
    name: "Ananya Singh",
    role: "Software Engineer",
    score: 82.1,
    status: "REVIEW",
  },
  {
    name: "Arjun Mehta",
    role: "Python Developer",
    score: 61.7,
    status: "REJECT",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-gray-100 px-6 py-6">
            <div className="text-2xl font-bold tracking-tight text-gray-950">
              Talent<span className="text-indigo-600">IQ</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Candidate Intelligence
            </p>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </p>

            <div className="space-y-1">
              <NavItem active label="Dashboard" icon="⌂" />
              <NavItem label="Jobs" icon="▣" />
              <NavItem label="Candidates" icon="♙" />
              <NavItem label="Analytics" icon="◫" />
            </div>

            <p className="mt-8 px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Management
            </p>

            <div className="space-y-1">
              <NavItem label="Email Decisions" icon="✉" />
              <NavItem label="Settings" icon="⚙" />
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
            <div className="flex items-center justify-between px-6 py-5 lg:px-10">
              <div>
                <p className="text-sm text-gray-500">Monday, August 10, 2026</p>
                <h1 className="mt-1 text-2xl font-bold text-gray-950">
                  Good morning, Kashish
                </h1>
              </div>

              <button className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                + Create Job
              </button>
            </div>
          </header>

          <div className="p-6 lg:p-10">
            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-gray-950">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                    {stat.change}
                  </p>
                </div>
              ))}
            </section>

            {/* Content */}
            <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              {/* Recent candidates */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                  <div>
                    <h2 className="font-semibold text-gray-950">
                      Recent Candidate Analysis
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Latest AI-powered screening results
                    </p>
                  </div>

                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    View all
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.name}
                      className="flex items-center justify-between gap-4 px-6 py-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                          {candidate.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {candidate.name}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {candidate.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-950">
                            {candidate.score}
                          </p>
                          <p className="text-[11px] text-gray-400">AI score</p>
                        </div>

                        <StatusBadge status={candidate.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-gray-950">Quick Actions</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Start your recruitment workflow
                </p>

                <div className="mt-6 space-y-3">
                  <ActionButton
                    title="Create a new job"
                    description="Define role requirements"
                  />
                  <ActionButton
                    title="Upload resumes"
                    description="Screen a candidate batch"
                  />
                  <ActionButton
                    title="Review candidates"
                    description="Inspect ranked candidates"
                  />
                </div>

                <div className="mt-6 rounded-xl bg-indigo-50 p-4">
                  <p className="text-sm font-semibold text-indigo-900">
                    AI Screening Active
                  </p>
                  <p className="mt-1 text-xs leading-5 text-indigo-700">
                    TalentIQ combines ATS matching with AI-based job relevance
                    analysis.
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

function NavItem({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <button
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

function StatusBadge({ status }: { status: string }) {
  const styles = {
    SHORTLIST: "bg-emerald-50 text-emerald-700",
    REVIEW: "bg-amber-50 text-amber-700",
    REJECT: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}

function ActionButton({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50">
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
      <span className="text-gray-400">→</span>
    </button>
  );
}

// src/app/admin/jobs/page.tsx
import { db } from '@/lib/db'
import { Briefcase, MapPin, CheckCircle, XCircle } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export const metadata = {
  title: 'Job Board Admin | CyberPulse',
}

export default async function AdminJobsPage() {
  const jobs = await db.job.findMany({
    orderBy: { createdAt: 'desc' },
  })

  async function toggleJobStatus(formData: FormData) {
    'use server'
    const jobId = formData.get('jobId') as string
    const current = formData.get('isActive') === 'true'
    if (!jobId) return

    await db.job.update({
      where: { id: jobId },
      data: { isActive: !current },
    })

    revalidatePath('/admin/jobs')
    revalidatePath('/jobs')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Cybersecurity Job Board</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administer career postings, partner job submissions, and applicant listings
          </p>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Total Postings: <span className="font-bold text-foreground">{jobs.length}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Job Position</span>
          <span className="w-32">Company & Location</span>
          <span className="w-24 text-center">Type</span>
          <span className="w-24 text-center">Status</span>
        </div>

        {jobs.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No job postings yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <div key={job.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate">{job.title}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {job.skills.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-32 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{job.company}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{job.location ?? 'Remote'}</p>
                </div>

                <div className="w-24 text-center">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground capitalize">
                    {job.workMode.toLowerCase()}
                  </span>
                </div>

                <div className="w-24 flex justify-center">
                  <form action={toggleJobStatus}>
                    <input type="hidden" name="jobId" value={job.id} />
                    <input type="hidden" name="isActive" value={String(job.isActive)} />
                    <button
                      type="submit"
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        job.isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {job.isActive ? 'Active' : 'Archived'}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

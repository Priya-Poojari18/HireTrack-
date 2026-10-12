import { useMemo, useState, useEffect, type FormEvent } from 'react';

import {

  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness,

  CalendarDays, Check, ChevronDown, CircleHelp, Clock3, FileText, Filter,

  LayoutDashboard, MessageSquare, MoreHorizontal, Plus, Search,

  Settings, Sparkles, Target, X, Zap,

} from 'lucide-react';

type ApplicationStatus = 'In Review' | 'Interview' | 'Offer' | 'Rejected';

type Job = { id: number; company: string; initials: string; color: string; role: string; location: string; type: string; salary: string; posted: string; status: ApplicationStatus; match: number };

const statusClass: Record<ApplicationStatus, string> = { 'In Review': 'review', Interview: 'interview', Offer: 'offer', Rejected: 'rejected' };

export default function App() {

 const [jobs, setJobs] = useState<Job[]>([]);

  const [query, setQuery] = useState('');

  useEffect(() => {

  fetch('http://localhost:8080/api/applications')

    .then((response) => {

      if (!response.ok) {

        throw new Error('Failed to load applications');

      }

      return response.json();

    })

    .then((data: Job[]) => {

      setJobs(data);

    })

    .catch((error) => {

      console.error('Error loading applications:', error);

    });

}, []);

  const [activeFilter, setActiveFilter] = useState('All applications');

  const [activeNav, setActiveNav] = useState('Overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('Priya Poojari');
const [careerInterest, setCareerInterest] = useState('Software Development');
const [preferredJobType, setPreferredJobType] = useState('Full-time');
const [applicationStats, setApplicationStats] = useState({
  total: 0,
  inReview: 0,
  interviews: 0,
  offers: 0,
  rejected: 0,
});
useEffect(() => {
  fetch('http://localhost:8080/api/profile')
    .then((response) => response.json())
    .then((data) => {
      setProfileName(data.name);
      setCareerInterest(data.careerInterest);
      setPreferredJobType(data.preferredJobType);
    })
    .catch((error) => {
      console.error('Failed to load profile:', error);
    });
}, []);
const loadApplicationStats = () => {
  fetch('http://localhost:8080/api/applications/stats')
    .then((response) => response.json())
    .then((data) => {
      setApplicationStats(data);
    })
    .catch((error) => {
      console.error('Failed to load application statistics:', error);
    });
};

useEffect(() => {
  loadApplicationStats();
}, []);

  const [showAdd, setShowAdd] = useState(false);

  const [role, setRole] = useState('');
  const [showEdit, setShowEdit] = useState(false);
const [editingJob, setEditingJob] = useState<Job | null>(null);
const [editRole, setEditRole] = useState('');
const [editCompany, setEditCompany] = useState('');
const [editLocation, setEditLocation] = useState('');
const [editType, setEditType] = useState('');
const [showDetails, setShowDetails] = useState(false);
const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');

  const [notice, setNotice] = useState('');

  const [showNotifications, setShowNotifications] = useState(false);

  const filteredJobs = useMemo(() => jobs.filter((job) => {

    const q = query.toLowerCase();

    const matchesQuery = `${job.role} ${job.company} ${job.location}`.toLowerCase().includes(q);

    const matchesFilter = activeFilter === 'All applications' || job.status === activeFilter;

    return matchesQuery && matchesFilter;

  }), [jobs, query, activeFilter]);

  const addApplication = async (e: FormEvent) => {
    e.preventDefault();

   if (!company.trim() || !role.trim() || !location.trim()) {
  setNotice('Please enter company, role, and location.');
  return;
}

    try {
      const response = await fetch('http://localhost:8080/api/applications', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  company: company.trim(),
  role: role.trim(),
  location: location.trim(),
}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save application.');
      }

      const getResponse = await fetch('http://localhost:8080/api/applications');
      if (!getResponse.ok) {
        throw new Error('Application saved, but reloading the list failed.');
      }

      const savedJobs: Job[] = await getResponse.json();
      setJobs(savedJobs);
      loadApplicationStats();
      setRole('');
setCompany('');
setLocation('');
setShowAdd(false);
      setActiveFilter('All applications');
      setNotice('Application saved successfully!');
      window.setTimeout(() => setNotice(''), 3000);
    } catch (error) {
      console.error('Error saving application:', error);
      setNotice(
        error instanceof Error
          ? error.message
          : 'Could not save application. Check the backend.'
      );
    }
  };
  const editApplication = async (e: FormEvent) => {
  e.preventDefault();

  if (!editingJob || !editCompany.trim() || !editRole.trim()) {
    setNotice('Please enter company and role.');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/applications/${editingJob.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
       body: JSON.stringify({
  company: editCompany.trim(),
  role: editRole.trim(),
  location: editLocation.trim(),
  type: editType.trim(),
}),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update application.');
    }

    const getResponse = await fetch(
      'http://localhost:8080/api/applications'
    );

    if (!getResponse.ok) {
      throw new Error('Application updated, but reloading failed.');
    }

    const savedJobs: Job[] = await getResponse.json();

    setJobs(savedJobs);
    loadApplicationStats();
    setShowEdit(false);
    setEditingJob(null);
    setEditRole('');
    setEditCompany('');
    setEditLocation('');
    setEditType('');
    setNotice('Application updated successfully!');

    window.setTimeout(() => setNotice(''), 3000);
  } catch (error) {
    console.error('Error updating application:', error);

    setNotice(
      error instanceof Error
        ? error.message
        : 'Could not update application.'
    );
  }
};

const deleteApplication = async (job: Job) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${job.company} - ${job.role}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/applications/${job.id}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete application.');
    }

    setJobs((currentJobs) =>
      currentJobs.filter((item) => item.id !== job.id)
    );
    loadApplicationStats();
    setNotice('Application deleted successfully!');

    window.setTimeout(() => setNotice(''), 3000);
  } catch (error) {
    console.error('Error deleting application:', error);

    setNotice(
      error instanceof Error
        ? error.message
        : 'Could not delete application.'
    );
  }
};const updateApplicationStatus = async (
  job: Job,
  newStatus: ApplicationStatus
) => {
  try {
    const response = await fetch(
  `http://localhost:8080/api/applications/${job.id}/status`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: newStatus,
  }
);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || 'Failed to update application status.'
      );
    }

    const updatedJob: Job = await response.json();

    setJobs((currentJobs) =>
  currentJobs.map((item) =>
    item.id === job.id ? updatedJob : item
  )
);

loadApplicationStats();

setNotice(`Status changed to ${newStatus}`);

    window.setTimeout(() => setNotice(''), 3000);
  } catch (error) {
    console.error('Error updating status:', error);

    setNotice(
      error instanceof Error
        ? error.message
        : 'Could not update application status.'
    );
  }
};
  const navItems = [

    { label: 'Overview', icon: LayoutDashboard }, { label: 'Find jobs', icon: Search },

    { label: 'My applications', icon: BriefcaseBusiness }, { label: 'Interviews', icon: CalendarDays },

    { label: 'Messages', icon: MessageSquare },

  ];

  return <div className="app-shell">

    <aside className="sidebar">

      <div className="brand"><div className="brand-mark"><Target size={20} strokeWidth={2.5}/></div><span>hiretrack<span className="brand-dot">.</span></span></div>

      <div className="workspace-label">WORKSPACE</div>

<nav className="main-nav">
  {navItems.map(({ label, icon: Icon }) => (
    <button
      key={label}
      type="button"
      className={`nav-item ${activeNav === label ? 'active' : ''}`}
      onClick={() => {
        setActiveNav(label);

        if (label === 'My applications') {
          setActiveFilter('All applications');
        }

        setNotice('');
      }}
    >
      <Icon size={18} />
      <span>{label}</span>

      {label === 'Messages' && (
        <span className="nav-count">2</span>
      )}
    </button>
  ))}
</nav>
      <div className="sidebar-divider"/><div className="workspace-label">PERSONAL</div>

     <button
  className={`nav-item ${activeNav === 'Settings' ? 'active' : ''}`}
  onClick={() => setActiveNav('Settings')}
>
  <Settings size={18}/>
  <span>Settings</span>
</button>
     <button
  className={`nav-item ${activeNav === 'Help center' ? 'active' : ''}`}
  onClick={() => setActiveNav('Help center')}
>
  <CircleHelp size={18}/>
  <span>Help center</span>
</button>
      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <div className="upgrade-icon"><Sparkles size={17}/>
          </div>
          <strong>Make your next move</strong><p>Keep your career journey organized and moving forward.</p>
          <button
  onClick={() => {
    setActiveNav('Overview');
    setNotice('Welcome to your HireTrack workspace.');
  }}
>
  Explore workspace <ArrowRight size={14}/>
</button>
        </div>
        <button
  type="button"
  className="profile-row"
  onClick={() => {
    setActiveNav('Settings');
    setNotice('');
  }}
>
  <div className="avatar">PP</div>

  <div className="profile-text">
    <strong>Priya Poojari</strong>
    <span>Candidate account</span>
  </div>

  <MoreHorizontal size={19} className="muted-icon" />
</button>
      </div>

    </aside>

    <main className="main-area">

      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeNav}</strong></div><div className="topbar-actions"><div className="status-pill"><span className="online-dot"/> All changes saved</div><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell size={19}/><span className="notification-dot"/></button>{showNotifications && <div className="notification-popover"><strong>Notifications</strong><p><span className="small-dot purple-dot"/> Your application tracker is up to date.</p><p><span className="small-dot green-dot"/> Keep preparing for upcoming interviews.</p></div>}<button className="help-button" onClick={() => setNotice('Tip: use search and filters to find an application quickly.')}><CircleHelp size={16}/> Help</button></div></header>

      <div className="page-content"> 

       {activeNav === 'Help center' ? (
  <section className="page-placeholder">
    <div className="eyebrow">
      <span className="eyebrow-line" />
      SUPPORT
    </div>

    <h1>Help center</h1>

    <p className="welcome-subtitle">
      Get help with managing your HireTrack applications.
    </p>

    <div className="panel" style={{ marginTop: '28px' }}>
      <div className="panel-heading">
        <div>
          <div className="section-kicker">QUICK HELP</div>
          <h2>How can we help?</h2>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <p className="panel-subtitle">
          <strong>Track an application:</strong> Use “Track a new application”
          to add a job to your pipeline.
        </p>

        <p className="panel-subtitle">
          <strong>Update an application:</strong> Use the Edit option to
          update company, role, location, or job type.
        </p>

        <p className="panel-subtitle">
          <strong>Track progress:</strong> Update the application status as
          your hiring process progresses.
        </p>
      </div>
    </div>
  </section>
) : activeNav === 'Settings' ? (
  <section className="page-placeholder">
    <div className="eyebrow">
      <span className="eyebrow-line" />
      PERSONAL
    </div>

    <h1>Settings</h1>

    <p className="welcome-subtitle">
      Manage your HireTrack workspace preferences.
    </p>

    <div className="panel" style={{ marginTop: '28px' }}>
      <div className="panel-heading">
        <div>
          <div className="section-kicker">ACCOUNT</div>
          <h2>Profile settings</h2>
          <button
  type="button"
  className="secondary-button"
  onClick={() => setIsEditingProfile(true)}
>
  Edit profile
</button>
        </div>
      </div>
  <div style={{ marginTop: '24px' }}>
  {!isEditingProfile ? (
    <>
      <h3>Personal Information</h3>

      <p className="panel-subtitle">
        <strong>Name:</strong> {profileName}
      </p>

      <p className="panel-subtitle">
        <strong>Account Type:</strong> Candidate
      </p>

      <p className="panel-subtitle">
        <strong>Career Interest:</strong> {careerInterest}
      </p>

      <p className="panel-subtitle">
       <strong>Preferred Job Type:</strong> {preferredJobType}
      </p>

      <p className="panel-subtitle">
        <strong>Application Tracking:</strong> Enabled
      </p>
    </>
  ) : (
    <>
      <h3>Edit Profile</h3>

      <div style={{ marginTop: '18px' }}>
        <label>Name</label>
        <input
  type="text"
  value={profileName}
  onChange={(e) => setProfileName(e.target.value)}
  style={{ display: 'block', marginTop: '8px', width: '100%' }}
/>
      </div>

      <div style={{ marginTop: '18px' }}>
        <label>Career Interest</label>
        <input
  type="text"
  value={careerInterest}
  onChange={(e) => setCareerInterest(e.target.value)}
  style={{ display: 'block', marginTop: '8px', width: '100%' }}
/>
      </div>

      <div style={{ marginTop: '18px' }}>
        <label>Preferred Job Type</label>
       <select
  value={preferredJobType}
  onChange={(e) => setPreferredJobType(e.target.value)}
  style={{ display: 'block', marginTop: '8px', width: '100%' }}
>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          type="button"
          className="primary-button"
          onClick={async () => {
            if (!profileName.trim()) {
  setNotice('Please enter your name.');
  return;
}

if (!careerInterest.trim()) {
  setNotice('Please enter your career interest.');
  return;
}

if (!preferredJobType.trim()) {
  setNotice('Please select your preferred job type.');
  return;
}
  try {
    const response = await fetch('http://localhost:8080/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: profileName,
        careerInterest: careerInterest,
        preferredJobType: preferredJobType,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    setIsEditingProfile(false);
    setNotice('Profile updated successfully.');
  } catch (error) {
    console.error('Failed to update profile:', error);
    setNotice('Failed to update profile.');
  }
}}
        >
          Save changes
        </button>

        <button
          type="button"
          className="secondary-button"
          style={{ marginLeft: '10px' }}
          onClick={() => setIsEditingProfile(false)}
        >
          Cancel
        </button>
      </div>
    </>
  )}
</div>
    </div>
  </section>
) : activeNav === 'Find jobs' ? (
  <section className="page-placeholder">
    <div className="eyebrow">
      <span className="eyebrow-line" />
      JOB DISCOVERY
    </div>

    <h1>Find jobs</h1>

    <p className="welcome-subtitle">
      Discover opportunities that match your career goals.
    </p>

    <div className="panel" style={{ marginTop: '28px' }}>
      <div className="panel-heading">
        <div>
          <div className="section-kicker">JOB SEARCH</div>
          <h2>Find your next opportunity</h2>
          <p className="panel-subtitle">
            Search for roles by title, company, or location.
          </p>
        </div>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search jobs..."
            aria-label="Search jobs"
          />
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setNotice('Job search integration will be added next.')
          }
        >
          <Search size={16} />
          Search jobs
        </button>
      </div>

      <div className="no-interview" style={{ marginTop: '30px' }}>
        <Search size={22} />
        <span>
          Job discovery is ready for API integration.
        </span>
      </div>
    </div>
  </section>
) : activeNav === 'My applications' ? (
  <section className="page-placeholder">
    <div className="eyebrow">
      <span className="eyebrow-line" />
      YOUR PIPELINE
    </div>

    <h1>My applications</h1>

    <p className="welcome-subtitle">
      Track and manage all your job applications.
    </p>

    <div className="panel" style={{ marginTop: '28px' }}>
      <div className="panel-heading">
        <div>
          <div className="section-kicker">APPLICATIONS</div>
          <h2>
            All applications{' '}
            <span className="count-badge">{jobs.length}</span>
          </h2>
          <p className="panel-subtitle">
            Keep track of every opportunity in one place.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={16} />
          Add application
        </button>
      </div>

      <div className="application-list" style={{ marginTop: '20px' }}>
        {jobs.length ? (
          jobs.map((job) => (
            <div className="application-row" key={job.id}>
              <div className={`company-logo ${job.color}`}>
                {job.initials}
              </div>

              <div
                className="job-info"
                onClick={() => {
                  setSelectedJob(job);
                  setShowDetails(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <strong>{job.role}</strong>
                <span>
                  {job.company}
                  <span className="meta-separator"> · </span>
                  {job.location}
                </span>
              </div>

              <span
                className={`status-badge ${statusClass[job.status]}`}
              >
                <span className="status-dot" />
                {job.status}
              </span>

              <button
                className="row-more"
                onClick={() => {
                  setEditingJob(job);
                  setEditCompany(job.company);
                  setEditRole(job.role);
                  setEditLocation(job.location);
                  setEditType(job.type);
                  setShowEdit(true);
                }}
                aria-label={`Edit ${job.company}`}
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="no-interview">
            <BriefcaseBusiness size={22} />
            <span>No applications yet.</span>
          </div>
        )}
      </div>
    </div>
  </section>
) : activeNav === 'Interviews' ? (
  <section className="page-placeholder">
    <div className="eyebrow">
      <span className="eyebrow-line" />
      INTERVIEW TRACKER
    </div>

    <h1>Interviews</h1>

    <p className="welcome-subtitle">
      Prepare for your upcoming interviews.
    </p>

    <div className="panel" style={{ marginTop: '28px' }}>
      <div className="panel-heading">
        <div>
          <div className="section-kicker">UPCOMING</div>
          <h2>Your interviews</h2>
          <p className="panel-subtitle">
            Applications currently in the interview stage.
          </p>
        </div>
      </div>

      <div className="application-list" style={{ marginTop: '20px' }}>
        {jobs.filter((job) => job.status === 'Interview').length ? (
          jobs
            .filter((job) => job.status === 'Interview')
            .map((job) => (
              <div className="application-row" key={job.id}>
                <div className={`company-logo ${job.color}`}>
                  {job.initials}
                </div>

                <div className="job-info">
                  <strong>{job.role}</strong>
                  <span>
                    {job.company}
                    <span className="meta-separator"> · </span>
                    {job.location}
                  </span>
                </div>

                <span className="status-badge interview">
                  <span className="status-dot" />
                  Interview
                </span>
              </div>
            ))
        ) : (
          <div className="no-interview">
            <CalendarDays size={22} />
            <span>No interviews scheduled yet.</span>
          </div>
        )}
      </div>
    </div>
  </section>
) : activeNav === 'Messages' ? (
  <section className="page-placeholder">
    <div className="eyebrow">
      <span className="eyebrow-line" />
      COMMUNICATION
    </div>

    <h1>Messages</h1>

    <p className="welcome-subtitle">
      Keep track of recruiter and company communication.
    </p>

    <div className="panel" style={{ marginTop: '28px' }}>
      <div className="panel-heading">
        <div>
          <div className="section-kicker">INBOX</div>
          <h2>Your messages</h2>
          <p className="panel-subtitle">
            Recruiter communication will appear here.
          </p>
        </div>
      </div>

      <div className="no-interview" style={{ marginTop: '30px' }}>
        <MessageSquare size={22} />
        <span>No messages yet.</span>
      </div>
    </div>
  </section>
) : (
   <>

        <section className="welcome-row"><div><div className="eyebrow">
          <span className="eyebrow-line"/> YOUR CAREER, IN FOCUS</div>
          <h1>Good morning, Priya <span className="wave">✳</span></h1><p className="welcome-subtitle">
            A little progress every day adds up to big opportunities.</p>
          </div><button className="primary-button" onClick={() => setShowAdd(true)}>
          <Plus size={17}/> Track an application</button>
          </section>

        <section className="stats-grid">

          <StatCard title="Total applications" value={String(applicationStats.total).padStart(2, '0')}
          caption="Across all companies" icon={<BriefcaseBusiness size={18}/>} 
          tone="purple" trend="Your career pipeline" />

          <StatCard title="In review" value={String(applicationStats.inReview).padStart(2, '0')}
          caption="Waiting for a response" icon={<Clock3 size={18}/>} tone="blue" trend="Applications in progress" />

          <StatCard title="Interviews"value={String(applicationStats.interviews).padStart(2, '0')}
          caption="Keep preparing" icon={<CalendarDays size={18}/>} tone="orange" trend="Next step in your journey" />

          <StatCard title="Offers received" value={String(applicationStats.offers).padStart(2, '0')}
          caption="Celebrate your progress" icon={<Sparkles size={18}/>} tone="green" trend="A milestone worth celebrating" />

        </section>

        <section className="content-grid">

          <div className="panel applications-panel"><div className="panel-heading"><div><div className="section-kicker">YOUR PIPELINE</div><h2>Recent applications <span className="count-badge">{jobs.length}</span></h2><p className="panel-subtitle">Keep every opportunity on your radar.</p></div><button className="text-button" onClick={() => { setActiveNav('My applications'); setActiveFilter('All applications'); }}>View all <ArrowRight size={15}/></button></div>

            <div className="table-toolbar"><div className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search company or role..." aria-label="Search applications"/><kbd>⌘ K</kbd></div><button className="filter-button" onClick={() => { const options = ['All applications', 'In Review', 'Interview', 'Offer', 'Rejected']; const i = options.indexOf(activeFilter); setActiveFilter(options[(i + 1) % options.length]); }}><Filter size={15}/> {activeFilter === 'All applications' ? 'Filter' : activeFilter}<ChevronDown size={14}/></button></div>

            <div className="application-list">{filteredJobs.length ? filteredJobs.map(job => <div className="application-row" key={job.id}><div className={`company-logo ${job.color}`}>{job.initials}</div><div
  className="job-info"
  onClick={() => {
    setSelectedJob(job);
    setShowDetails(true);
  }}
  style={{ cursor: 'pointer' }}
><strong>{job.role}</strong><span>{job.company} <span className="meta-separator">·</span> {job.location}</span></div><div className="job-match"><div className="match-line"><span>Skill match</span><strong>{job.match}%</strong></div><div className="match-track"><div style={{width: `${job.match}%`}}/></div></div><span className={`status-badge ${statusClass[job.status]}`}><span className="status-dot"/>{job.status}</span><select
  value={job.status}
  onChange={(e) =>
    updateApplicationStatus(
      job,
      e.target.value as ApplicationStatus
    )
  }
  aria-label={`Change status for ${job.company}`}
>
  <option value="In Review">In Review</option>
  <option value="Interview">Interview</option>
  <option value="Offer">Offer</option>
  <option value="Rejected">Rejected</option>
</select><span className="posted-date">{job.posted}</span><button
  className="row-more"
  aria-label={`Edit ${job.company}`}
  onClick={() => {
    setEditingJob(job);
    setEditCompany(job.company);
    setEditRole(job.role);
    setEditLocation(job.location);
    setEditType(job.type);
    setShowEdit(true);
  }}
>
  <MoreHorizontal size={18}/>
</button> <button
  className="row-more"
  aria-label={`Delete ${job.company}`}
  title="Delete application"
  onClick={() => deleteApplication(job)}
>
  <X size={18}/>
</button></div>) : <div className="empty-state"><Search size={22}/><strong>No applications found</strong>

<span>Try another search or change your filter.</span></div>}</div>

            <div className="list-footer"><span>Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}

            </strong>
             applications</span>
            <button onClick={() => setShowAdd(true)}><Plus size={14}/> Add application</button></div>

          </div>

          <div className="right-column"><div className="panel progress-panel"><div className="panel-heading compact"><div><div className="section-kicker">WEEKLY SNAPSHOT</div><h2>Your momentum</h2></div><button className="icon-button small" aria-label="More momentum options" onClick={() => setNotice('Weekly progress is based on the applications currently in your tracker.')}><MoreHorizontal size={18}/></button></div><div className="momentum-graphic"><div className="ring-wrap"><svg viewBox="0 0 120 120" className="progress-ring"><circle cx="60" cy="60" r="48" className="ring-bg"/><circle cx="60" cy="60" r="48" className="ring-progress" strokeDasharray="301.6" strokeDashoffset={301.6 * (1 - Math.min(jobs.length / 10, 1))}/></svg><div className="ring-center"><strong>{Math.min(jobs.length * 10, 100)}%</strong><span>of goal</span></div></div><div className="goal-copy"><span className="goal-label"><Zap size={14}/> WEEKLY GOAL</span><strong>Track 10 applications</strong><p>You're building a habit. Keep the momentum going.</p><div className="goal-count"><strong>{jobs.length} <span>/ 10</span></strong><span>{Math.max(10 - jobs.length, 0)} to go</span></div></div></div><div className="progress-footer"><Activity size={15}/><span>Consistency beats intensity.</span><Sparkles size={15} className="footer-sparkle"/></div></div>

            <div className="panel interview-panel"><div className="panel-heading compact"><div><div className="section-kicker">UP NEXT</div><h2>Interview preparation</h2></div><span className="calendar-icon"><CalendarDays size={17}/></span></div>{jobs.some(j => j.status === 'Interview') ? <div className="interview-card"><div className="interview-date"><span>OCT</span><strong>08</strong></div><div className="interview-detail"><strong>{jobs.find(j => j.status === 'Interview')?.company} interview</strong><span>Software engineering · Technical round</span><div className="interview-time"><Clock3 size={13}/> Add your confirmed interview time</div></div></div> : <div className="no-interview"><CalendarDays size={19}/><span>No upcoming interviews added yet.</span></div>}<button className="outline-button" onClick={() => setNotice('Interview scheduling will be connected to your saved applications in a later milestone.')}>Prepare for interviews <ArrowRight size={15}/></button></div>

          </div>

        </section>

        <section className="bottom-tip"><div className="tip-icon"><Sparkles size={18}/></div><div><strong>A small tip for your next move</strong><p>Tailor your resume to the role and highlight projects that demonstrate the skills listed in the job description.</p></div><button onClick={() => setNotice('Tip saved for your next application.')}>Got it <Check size={15}/></button></section>

        <footer className="page-footer"><span>© 2026 HireTrack</span><span>Built for your next opportunity <span className="footer-heart">♥</span></span><span>Candidate workspace · Demo data</span></footer>

     </>
)}
</div>

    </main>

    {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}>
        <div className="modal-heading"><div>
          <div className="section-kicker">YOUR PIPELINE</div>
        <h2 id="modal-title">Track a new application</h2><p>Add an opportunity to keep it organized.</p>
        </div><button className="icon-button" onClick={() => setShowAdd(false)} aria-label="Close dialog"><X size={18}/>
        </button>
        </div>
        <form onSubmit={addApplication}>
          <label>Job title<input autoFocus value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Java Developer" required/>
          </label><label>Company name<input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Infosys" required/>
          </label>
          <label>
  Location
  <input
    value={location}
    onChange={e => setLocation(e.target.value)}
    placeholder="e.g. Bengaluru, India"
    required
  />
</label>
          <div className="modal-note"><FileText size={16}/><span>New applications start with the <strong>In Review</strong> status. You can track their progress here.</span></div><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="primary-button">
      <Plus size={16}/> Add application</button></div></form></div></div>}

    {notice && <div className="toast"><Check size={17}/><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message"><X size={15}/></button></div>}

{showDetails && selectedJob && (<div
    className="modal-backdrop"
    onClick={() => setShowDetails(false)}
  >
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-heading">
        <div>
          <div className="section-kicker">APPLICATION DETAILS</div>
          <h2>{selectedJob.role}</h2>
          <p>{selectedJob.company}</p>
        </div>

        <button
          className="icon-button"
          onClick={() => setShowDetails(false)}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="application-details">
        <div>
          <strong>Company</strong>
          <span>{selectedJob.company}</span>
        </div>

        <div>
          <strong>Job Role</strong>
          <span>{selectedJob.role}</span>
        </div>

        <div>
          <strong>Status</strong>
          <span>{selectedJob.status}</span>
        </div>

        <div>
          <strong>Location</strong>
          <span>{selectedJob.location || 'Not specified'}</span>
        </div>

        <div>
          <strong>Job Type</strong>
          <span>{selectedJob.type || 'Not specified'}</span>
        </div>

        <div>
          <strong>Salary</strong>
          <span>{selectedJob.salary || 'Not specified'}</span>
        </div>

        <div>
          <strong>Skill Match</strong>
          <span>{selectedJob.match}%</span>
        </div>

        <div>
          <strong>Posted</strong>
          <span>{selectedJob.posted}</span>
        </div>
      </div>

      <div className="modal-actions">
        <button
          className="outline-button"
          onClick={() => setShowDetails(false)}
        >
          Close
        </button>

        <button
          className="primary-button"
          onClick={() => {
            setShowDetails(false);
            setEditingJob(selectedJob);
            setEditCompany(selectedJob.company);
            setEditRole(selectedJob.role);
            setEditLocation(selectedJob.location);
            setEditType(selectedJob.type);
            setShowEdit(true);
          }}
        >
          Edit application
        </button>
      </div>
    </div>
  </div>
)}

{showEdit && (
  <div
    className="modal-backdrop"
    onClick={() => setShowEdit(false)}
  >
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-heading">
        <div>
          <div className="section-kicker">YOUR PIPELINE</div>
          <h2 id="edit-modal-title">Edit application</h2>
          <p>Update your application details.</p>
        </div>

        <button
          className="icon-button"
          onClick={() => setShowEdit(false)}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={editApplication}>
      <label>
  Job Role
  <select
    value={editRole}
    onChange={(e) => setEditRole(e.target.value)}
    required
  >
    <option value="">Select Job Role</option>
    <option value="Java Developer">Java Developer</option>
    <option value="Software Engineer">Software Engineer</option>
    <option value="Full Stack Developer">Full Stack Developer</option>
    <option value="Frontend Developer">Frontend Developer</option>
    <option value="Backend Developer">Backend Developer</option>
    <option value="Software Engineer Intern">Software Engineer Intern</option>
    <option value="Data Analyst">Data Analyst</option>
    <option value="DevOps Engineer">DevOps Engineer</option>
    <option value="QA Engineer">QA Engineer</option>
    <option value="Associate Software Engineer">Associate Software Engineer</option>
  </select>
</label>

        <label>
          Company name
          <input
            value={editCompany}
            onChange={(e) => setEditCompany(e.target.value)}
            placeholder="e.g. Infosys"
            required
          />
        </label>
        <label>
  Location
  <select
    value={location}
    onChange={e => setLocation(e.target.value)}
    required
  >
    <option value="">Select Location</option>
    <option value="Bengaluru, India">Bengaluru, India</option>
    <option value="Bengaluru Urban">Bengaluru Urban</option>
    <option value="Chennai, India">Chennai, India</option>
    <option value="Hyderabad, India">Hyderabad, India</option>
    <option value="Pune, India">Pune, India</option>
    <option value="Mumbai, India">Mumbai, India</option>
    <option value="Delhi, India">Delhi, India</option>
    <option value="Noida, India">Noida, India</option>
    <option value="Gurugram, India">Gurugram, India</option>
    <option value="Remote">Remote</option>
    <option value="Hybrid">Hybrid</option>
  </select>
</label>

<label>
  Job Type
  <select
    value={editType}
    onChange={(e) => setEditType(e.target.value)}
    required
  >
    <option value="">Select Job Type</option>
    <option value="Full-time">Full-time</option>
    <option value="Part-time">Part-time</option>
    <option value="Internship">Internship</option>
    <option value="Contract">Contract</option>
    <option value="Freelance">Freelance</option>
  </select>
</label>

        <div className="modal-actions">
          <button
            type="button"
            className="outline-button"
            onClick={() => setShowEdit(false)}
          >
            Cancel
          </button>

          <button type="submit" className="primary-button">
            <Check size={16} />
            Save changes
          </button>
        </div>
      </form>
    </div>
  </div>
  
)}

  </div>;

}

function StatCard({ title, value, caption, icon, tone, trend }: { title: string; value: string; caption: string; icon: React.ReactNode; tone: string; trend: string }) {

  return <div className="stat-card"><div className="stat-top"><div className={`stat-icon ${tone}`}>{icon}</div><button className="stat-menu" aria-label={`${title} details`} title={trend}><MoreHorizontal size={18}/></button></div><div className="stat-title">{title}</div><div className="stat-value-row"><strong>{value}</strong><span className={`stat-trend ${tone}`}>{tone === 'green' ? <ArrowUpRight size={14}/> : tone === 'orange' ? <ArrowDownRight size={14}/> : <Activity size={13}/>} {tone === 'green' ? 'Growing' : tone === 'orange' ? 'Stay ready' : 'On track'}</span></div><div className="stat-caption">{caption}</div></div>;

}

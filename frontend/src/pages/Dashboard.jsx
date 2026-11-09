import { useEffect, useState } from "react";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock3,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [submissionRes, guidelineRes] = await Promise.all([
          api.get("/api/submissions/"),
          api.get("/api/guidelines/"),
        ]);

        setSubmissions(submissionRes.data);
        setGuidelines(guidelineRes.data);
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const pending = submissions.filter(
    (item) => item.status === "needs_review" || item.status === "pending"
  ).length;

  const compliant = submissions.filter(
    (item) => item.status === "compliant"
  ).length;

  const stats = [
    {
      label: "Total Submissions",
      value: submissions.length,
      icon: FileText,
      color: "blue",
    },
    {
      label: "Compliant Content",
      value: compliant,
      icon: ShieldCheck,
      color: "green",
    },
    {
      label: "Needs Review",
      value: pending,
      icon: AlertTriangle,
      color: "amber",
    },
    {
      label: "Active Guidelines",
      value: guidelines.filter((item) => item.approved).length,
      icon: Clock3,
      color: "purple",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">WORKSPACE OVERVIEW</span>
          <h1>Brand governance, at a glance.</h1>
          <p>
            Monitor content compliance, review submissions, and protect
            your brand standards.
          </p>
        </div>

        <a href="/submissions/new" className="primary-button">
          <Plus size={17} />
          New submission
        </a>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.label}>
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={20} />
              </div>
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">
                {loading ? "—" : stat.value}
              </strong>
              <span className="stat-caption">Current workspace data</span>
            </div>
          );
        })}
      </div>

      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Recent submissions</h2>
            <p>Latest content submitted for brand compliance checks.</p>
          </div>

          <a href="/submissions" className="text-link">
            View all <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="table-card">
          {loading ? (
            <div className="empty-state">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="empty-state">
              <FileText size={30} />
              <strong>No submissions yet</strong>
              <span>Create your first submission to begin reviewing content.</span>
            </div>
          ) : (
            <div className="submission-list">
              {submissions.slice(0, 5).map((item) => (
                <div className="submission-row" key={item.id}>
                  <div className="submission-file-icon">
                    <FileText size={18} />
                  </div>

                  <div className="submission-info">
                    <strong>{item.title}</strong>
                    <span>
                      Submission #{item.id}
                    </span>
                  </div>

                  <span
                    className={`status-pill ${item.status}`}
                  >
                    {item.status.replaceAll("_", " ")}
                  </span>

                  <strong className="score">
                    {item.compliance_score ?? "—"}
                    {item.compliance_score != null ? "/100" : ""}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
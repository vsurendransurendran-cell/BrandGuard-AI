
import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const response = await api.get("/api/submissions/");
        setSubmissions(response.data);
      } catch (error) {
        console.error("Failed to load submissions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="submissions-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">CONTENT WORKSPACE</span>
          <h1>Submissions</h1>
          <p>
            Track submitted content, compliance results, and review progress.
          </p>
        </div>

        <Link to="/submissions/new" className="primary-button">
          <Plus size={17} />
          New submission
        </Link>
      </div>

      <div className="submission-toolbar">
        <div className="submission-count">
          <strong>{loading ? "—" : submissions.length}</strong>
          <span>Total submissions</span>
        </div>

        <div className="submission-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search submissions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="table-card submissions-table">
        <div className="submission-table-heading">
          <span>SUBMISSION</span>
          <span>STATUS</span>
          <span>COMPLIANCE SCORE</span>
          <span>RECORD</span>
        </div>

        {loading ? (
          <div className="empty-state">
            <span>Loading submissions...</span>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="empty-state">
            <FileText size={30} />
            <strong>
              {search ? "No matching submissions" : "No submissions yet"}
            </strong>
            <span>
              {search
                ? "Try a different search term."
                : "Create your first submission to start the compliance review process."}
            </span>
            {!search && (
              <Link to="/submissions/new" className="primary-button">
                <Plus size={16} />
                Create submission
              </Link>
            )}
          </div>
        ) : (
          filteredSubmissions.map((item) => (
            <div className="submission-table-row" key={item.id}>
              <div className="submission-table-title">
                <div className="submission-file-icon">
                  <FileText size={18} />
                </div>
                <div>
                  <strong>{item.title}</strong>
                  <span>Submission #{item.id}</span>
                </div>
              </div>

              <div>
                <span className={`status-pill ${item.status}`}>
                  {item.status?.replaceAll("_", " ")}
                </span>
              </div>

              <strong className="score">
                {item.compliance_score ?? "—"}
                {item.compliance_score != null ? "/100" : ""}
              </strong>

              <Link
                to={`/submissions/${item.id}`}
                className="submission-open-link"
                aria-label={`Open submission ${item.id}`}
              >
                <ArrowUpRight size={17} />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

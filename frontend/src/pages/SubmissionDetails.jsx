import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Lightbulb,
  ClipboardCheck,
  Send,
} from "lucide-react";
import api from "../services/api";

export default function SubmissionDetails() {
  const { id } = useParams();

  const [submission, setSubmission] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewerName, setReviewerName] = useState("");
  const [comments, setComments] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    async function loadDetails() {
      try {
        const [submissionRes, issuesRes] = await Promise.all([
          api.get(`/api/submissions/${id}`),
          api.get(`/api/issues/submission/${id}`),
        ]);

        setSubmission(submissionRes.data);
        setIssues(issuesRes.data);
      } catch (err) {
        console.error("Failed to load submission details:", err);
        setError(
          err.response?.data?.detail ||
          "Unable to load submission details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [id]);

  async function handleReview(decision) {
    if (!reviewerName.trim()) {
      setReviewError("Please enter the reviewer name.");
      return;
    }

    if (decision !== "approved" && !comments.trim()) {
      setReviewError("Please provide comments for this decision.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError("");
      setReviewSuccess("");

      const response = await api.post("/api/reviews/", {
        submission_id: Number(id),
        decision,
        reviewer_name: reviewerName.trim(),
        comments: comments.trim(),
      });

      setSubmission((previous) => ({
        ...previous,
        status: response.data.decision,
      }));

      setReviewSuccess(
        `Review decision "${decision.replaceAll("_", " ")}" saved successfully.`
      );
    } catch (err) {
      console.error("Review submission failed:", err);
      setReviewError(
        err.response?.data?.detail ||
        "Unable to save review decision. Please try again."
      );
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading) {
    return <div className="empty-state">Loading submission details...</div>;
  }

  if (error || !submission) {
    return (
      <div className="submission-detail-page">
        <Link to="/submissions" className="back-button">
          <ArrowLeft size={16} />
          Back to submissions
        </Link>
        <div className="empty-state">
          <AlertTriangle size={30} />
          <strong>Submission unavailable</strong>
          <span>{error || "The requested submission was not found."}</span>
        </div>
      </div>
    );
  }

  const status = submission.status || "pending";
  const score = submission.compliance_score;

  const reviewCompleted = [
    "approved",
    "rejected",
    "changes_requested",
  ].includes(status);

  return (
    <div className="submission-detail-page">
      <Link to="/submissions" className="back-button">
        <ArrowLeft size={16} />
        Back to submissions
      </Link>

      <div className="detail-heading">
        <div>
          <span className="eyebrow">COMPLIANCE ASSESSMENT</span>
          <h1>{submission.title}</h1>
          <p>Submission #{submission.id}</p>
        </div>

        <span className={`status-pill ${status}`}>
          {status.replaceAll("_", " ")}
        </span>
      </div>

      <div className="detail-stats">
        <div className="detail-stat-card">
          <div className="detail-stat-icon">
            <ShieldCheck size={20} />
          </div>
          <span>Compliance score</span>
          <strong>
            {score != null ? `${score}/100` : "Not available"}
          </strong>
        </div>

        <div className="detail-stat-card">
          <div className="detail-stat-icon warning">
            <AlertTriangle size={20} />
          </div>
          <span>Detected issues</span>
          <strong>{issues.length}</strong>
        </div>

        <div className="detail-stat-card">
          <div className="detail-stat-icon">
            <Clock3 size={20} />
          </div>
          <span>Submission status</span>
          <strong className="detail-status-value">
            {status.replaceAll("_", " ")}
          </strong>
        </div>
      </div>

      <section className="detail-section">
        <div className="detail-section-heading">
          <FileText size={19} />
          <div>
            <h2>Submitted content</h2>
            <p>Original content provided for compliance assessment.</p>
          </div>
        </div>

        <div className="original-content">
          {submission.content}
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-section-heading">
          <AlertTriangle size={19} />
          <div>
            <h2>Compliance findings</h2>
            <p>Issues identified during the automated assessment.</p>
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="detail-success">
            <CheckCircle2 size={22} />
            <div>
              <strong>No compliance issues detected</strong>
              <span>No issues were returned for this submission.</span>
            </div>
          </div>
        ) : (
          <div className="issue-list">
            {issues.map((issue) => (
              <article className="issue-card" key={issue.id}>
                <div className="issue-card-header">
                  <strong>{issue.category?.replaceAll("_", " ")}</strong>
                  <span className={`severity-pill ${issue.severity}`}>
                    {issue.severity}
                  </span>
                </div>

                <p>{issue.description}</p>

                {issue.suggested_fix && (
                  <div className="suggested-fix">
                    <Lightbulb size={17} />
                    <div>
                      <strong>Suggested improvement</strong>
                      <span>{issue.suggested_fix}</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="detail-section review-section">
        <div className="detail-section-heading">
          <ClipboardCheck size={20} />
          <div>
            <h2>Human review</h2>
            <p>Final decision by an authorized brand reviewer.</p>
          </div>
        </div>

        {reviewCompleted ? (
          <div className="detail-success">
            <CheckCircle2 size={22} />
            <div>
              <strong>Review decision recorded</strong>
              <span>
                Current decision: {status.replaceAll("_", " ")}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="review-form">
              <div className="form-field">
                <label htmlFor="reviewerName">Reviewer name</label>
                <input
                  id="reviewerName"
                  type="text"
                  placeholder="Enter reviewer name"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="reviewComments">
                  Review comments
                </label>
                <textarea
                  id="reviewComments"
                  rows="4"
                  placeholder="Explain your decision or provide feedback..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>

            {reviewError && (
              <div className="form-error">{reviewError}</div>
            )}

            {reviewSuccess && (
              <div className="detail-success">
                <CheckCircle2 size={20} />
                <strong>{reviewSuccess}</strong>
              </div>
            )}

            <div className="review-actions">
              <button
                className="review-button approve"
                disabled={reviewSubmitting}
                onClick={() => handleReview("approved")}
              >
                <CheckCircle2 size={17} />
                Approve
              </button>

              <button
                className="review-button changes"
                disabled={reviewSubmitting}
                onClick={() => handleReview("changes_requested")}
              >
                <Lightbulb size={17} />
                Request Changes
              </button>

              <button
                className="review-button reject"
                disabled={reviewSubmitting}
                onClick={() => handleReview("rejected")}
              >
                <Send size={16} />
                Reject
              </button>
            </div>

            {reviewSubmitting && (
              <p className="review-loading">Saving review decision...</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
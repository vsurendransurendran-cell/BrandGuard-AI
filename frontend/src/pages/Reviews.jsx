
import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock3,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/reviews/");
      setReviews(response.data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to load review history."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  function getDecisionIcon(decision) {
    if (decision === "approved") return CheckCircle2;
    if (decision === "rejected") return XCircle;
    return AlertCircle;
  }

  function getDecisionClass(decision) {
    if (decision === "approved") return "approved";
    if (decision === "rejected") return "rejected";
    return "changes-requested";
  }

  return (
    <div className="reviews-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">GOVERNANCE / AUDIT TRAIL</span>
          <h1>Review History</h1>
          <p>
            A complete record of human decisions across submitted content.
          </p>
        </div>

        <button
          className="review-refresh-button"
          onClick={loadReviews}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="reviews-summary">
        <div className="reviews-summary-card">
          <ClipboardCheck size={20} />
          <span>Total reviews</span>
          <strong>{reviews.length}</strong>
        </div>

        <div className="reviews-summary-card">
          <CheckCircle2 size={20} />
          <span>Approved</span>
          <strong>
            {reviews.filter((r) => r.decision === "approved").length}
          </strong>
        </div>

        <div className="reviews-summary-card">
          <XCircle size={20} />
          <span>Rejected</span>
          <strong>
            {reviews.filter((r) => r.decision === "rejected").length}
          </strong>
        </div>

        <div className="reviews-summary-card">
          <AlertCircle size={20} />
          <span>Changes requested</span>
          <strong>
            {reviews.filter(
              (r) => r.decision === "changes_requested"
            ).length}
          </strong>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading review history...</div>
      ) : error ? (
        <div className="empty-state">
          <AlertCircle size={28} />
          <strong>Unable to load reviews</strong>
          <span>{error}</span>
          <button
            className="review-refresh-button"
            onClick={loadReviews}
          >
            Try again
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <ClipboardCheck size={32} />
          <strong>No reviews recorded yet</strong>
          <span>Human review decisions will appear here.</span>
        </div>
      ) : (
        <div className="review-history-list">
          {reviews.map((review) => {
            const Icon = getDecisionIcon(review.decision);

            return (
              <article className="review-history-card" key={review.id}>
                <div className="review-history-top">
                  <div className="review-history-icon">
                    <ClipboardCheck size={19} />
                  </div>

                  <div className="review-history-title">
                    <strong>
                      Submission #{review.submission_id}
                    </strong>
                    <span>
                      Reviewed by {review.reviewer_name}
                    </span>
                  </div>

                  <span
                    className={`review-decision ${getDecisionClass(
                      review.decision
                    )}`}
                  >
                    <Icon size={14} />
                    {review.decision.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="review-history-comment">
                  <span>REVIEW COMMENTS</span>
                  <p>
                    {review.comments || "No comments provided."}
                  </p>
                </div>

                <div className="review-history-date">
                  <Clock3 size={14} />
                  {review.created_at
                    ? new Date(review.created_at).toLocaleString()
                    : "Date unavailable"}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Send } from "lucide-react";
import api from "../services/api";

export default function NewSubmission() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and content.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/submissions/", {
        title: title.trim(),
        content: content.trim(),
      });

      navigate(`/submissions/${response.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="submission-page">
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        Back to overview
      </button>

      <div className="submission-heading">
        <span className="eyebrow">CONTENT GOVERNANCE</span>
        <h1>New submission</h1>
        <p>
          Submit content for an automated brand compliance assessment.
        </p>
      </div>

      <form className="submission-form" onSubmit={handleSubmit}>
        <div className="form-title">
          <div className="form-icon">
            <FileText size={20} />
          </div>
          <div>
            <h2>Content details</h2>
            <p>Provide the content you want VINSYREX to review.</p>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="title">Submission title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Product launch campaign"
            maxLength={150}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="content">Content to review</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your marketing copy, campaign text, product description..."
            rows={10}
            required
          />
          <span className="character-count">
            {content.length} characters
          </span>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-footer">
          <span>Content will be checked against approved guidelines.</span>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            <Send size={16} />
            {loading ? "Submitting..." : "Submit for review"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  X,
  CheckCircle2,
  Pencil,
  Power,
} from "lucide-react";
import api from "../services/api";

export default function Guidelines() {
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("prohibited_term");
  const [rule, setRule] = useState("");

  async function loadGuidelines() {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/guidelines/");
      setGuidelines(response.data);
    } catch (err) {
      console.error("Guidelines loading failed:", err);
      setError(err.response?.data?.detail || "Unable to load brand guidelines.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuidelines();
  }, []);

  function resetForm() {
    setName("");
    setCategory("prohibited_term");
    setRule("");
    setEditingId(null);
    setShowForm(false);
  }

  function startEditing(item) {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setRule(item.rule);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  async function handleSaveGuideline(e) {
    e.preventDefault();

    if (!name.trim() || !rule.trim()) {
      setError("Please complete all guideline fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: name.trim(),
        category,
        rule: rule.trim(),
        approved: editingId
          ? guidelines.find((item) => item.id === editingId)?.approved ?? true
          : true,
      };

      if (editingId) {
        await api.put(`/api/guidelines/${editingId}`, payload);
      } else {
        await api.post("/api/guidelines/", payload);
      }

      resetForm();
      await loadGuidelines();

      setSuccess(
        editingId
          ? "Guideline updated successfully."
          : "New brand guideline created successfully."
      );
    } catch (err) {
      console.error("Guideline save failed:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to save guideline. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleGuideline(item) {
    try {
      setError("");
      setSuccess("");

      await api.put(`/api/guidelines/${item.id}`, {
        name: item.name,
        category: item.category,
        rule: item.rule,
        approved: !item.approved,
      });

      await loadGuidelines();
      setSuccess(
        `Guideline ${item.approved ? "deactivated" : "activated"} successfully.`
      );
    } catch (err) {
      console.error("Guideline status update failed:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to update guideline status."
      );
    }
  }

  async function handleDeleteGuideline(item) {
    const confirmed = window.confirm(
      `Delete the guideline "${item.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/api/guidelines/${item.id}`);

      if (editingId === item.id) resetForm();

      await loadGuidelines();
      setSuccess("Guideline deleted successfully.");
    } catch (err) {
      console.error("Guideline deletion failed:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to delete guideline."
      );
    }
  }

  return (
    <div className="guidelines-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">BRAND GOVERNANCE / RULEBOOK</span>
          <h1>Brand Guidelines</h1>
          <p>Define and manage the rules that protect your brand identity.</p>
        </div>

        <button
          className="primary-button guideline-create-button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? <X size={17} /> : <Plus size={17} />}
          {showForm ? "Close" : "New guideline"}
        </button>
      </div>

      {success && (
        <div className="detail-success guideline-message">
          <CheckCircle2 size={20} />
          <strong>{success}</strong>
        </div>
      )}

      {error && (
        <div className="guideline-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <section className="detail-section guideline-form-section">
          <div className="detail-section-heading">
            {editingId ? <Pencil size={20} /> : <Plus size={20} />}
            <div>
              <h2>{editingId ? "Edit guideline" : "Create a guideline"}</h2>
              <p>
                {editingId
                  ? "Update this brand governance rule."
                  : "Add a new rule to your brand governance system."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveGuideline}>
            <div className="form-field">
              <label htmlFor="guidelineName">Rule name or term</label>
              <input
                id="guidelineName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Example: guaranteed"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="guidelineCategory">Rule category</label>
              <select
                id="guidelineCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="prohibited_term">Prohibited term</option>
                <option value="required_term">Required term</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="guidelineRule">Rule description</label>
              <textarea
                id="guidelineRule"
                rows="4"
                value={rule}
                onChange={(e) => setRule(e.target.value)}
                placeholder="Explain how this rule should be applied..."
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update guideline"
                  : "Save guideline"}
            </button>

            <button
              type="button"
              className="review-refresh-button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          </form>
        </section>
      )}

      <div className="guidelines-summary">
        <div className="guideline-stat">
          <BookOpen size={20} />
          <span>Total guidelines</span>
          <strong>{guidelines.length}</strong>
        </div>

        <div className="guideline-stat">
          <ShieldCheck size={20} />
          <span>Active guidelines</span>
          <strong>{guidelines.filter((item) => item.approved).length}</strong>
        </div>

        <div className="guideline-stat">
          <AlertTriangle size={20} />
          <span>Inactive guidelines</span>
          <strong>{guidelines.filter((item) => !item.approved).length}</strong>
        </div>
      </div>

      <div className="guidelines-list-header">
        <div>
          <h2>Governance rules</h2>
          <p>Rules used during automated compliance assessment.</p>
        </div>

        <button
          className="review-refresh-button"
          onClick={loadGuidelines}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Loading guidelines...</div>
      ) : guidelines.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={30} />
          <strong>No guidelines available</strong>
          <span>Create your first brand guideline to get started.</span>
        </div>
      ) : (
        <div className="guidelines-list">
          {guidelines.map((item) => (
            <article className="guideline-card" key={item.id}>
              <div className="guideline-card-icon">
                <BookOpen size={19} />
              </div>

              <div className="guideline-card-content">
                <div className="guideline-card-heading">
                  <h3>{item.name}</h3>
                  <span
                    className={`guideline-status ${
                      item.approved ? "active" : "inactive"
                    }`}
                  >
                    {item.approved ? "Active" : "Inactive"}
                  </span>
                </div>

                <span className="guideline-category">
                  {item.category?.replaceAll("_", " ")}
                </span>

                <p>{item.rule}</p>

                <div className="guideline-actions">
                  <button
                    className="review-refresh-button"
                    onClick={() => startEditing(item)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    className="review-refresh-button"
                    onClick={() => toggleGuideline(item)}
                  >
                    <Power size={15} />
                    {item.approved ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    className="review-refresh-button guideline-delete-button"
                    onClick={() => handleDeleteGuideline(item)}
                  >
                    <X size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

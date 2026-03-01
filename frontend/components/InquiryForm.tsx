/// <reference types="vite/client" />
import React, { useState, type ChangeEvent, type FormEvent } from "react";

type InquiryData = {
  name: string;
  phone: string;
  fromDestination: string;
  toDestination: string;
  notes: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

type InquiryFormProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

const InquiryForm: React.FC<InquiryFormProps> = ({ isDark, onToggleTheme }) => {
  const [form, setForm] = useState<InquiryData>({
    name: "",
    phone: "",
    fromDestination: "",
    toDestination: "",
    notes: "",
  });

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (submitState === "error") {
      setSubmitState("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send inquiry");
      }

      setSubmitState("success");
      setForm({
        name: "",
        phone: "",
        fromDestination: "",
        toDestination: "",
        notes: "",
      });
    } catch (err) {
      setSubmitState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      console.error(err);
    }
  };

  const handleSubmitAnother = () => {
    setSubmitState("idle");
    setErrorMessage("");
  };

  const loading = submitState === "loading";
  const success = submitState === "success";
  const error = submitState === "error";

  return (
    <div className="inquiry-page">
      <div className="inquiry-card">
        <div className="inquiry-card-top">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
        {success ? (
          <div className="inquiry-success">
            <div className="success-icon-wrap" aria-hidden>
              <svg className="success-circle" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="success-circle-path" strokeLinecap="round" strokeWidth="2" d="M14 27l8 8 16-18" />
                <circle className="success-circle-bg" cx="26" cy="26" r="24" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="success-title">Inquiry sent</h2>
            <p className="success-text">We’ll get back to you shortly.</p>
            <button type="button" onClick={handleSubmitAnother} className="form-submit form-submit-secondary">
              Submit another
            </button>
          </div>
        ) : (
          <>
            <header className="inquiry-header">
              <h1 className="inquiry-title">Car Inquiry</h1>
              <p className="inquiry-subtitle">Share your details and we’ll get back to you.</p>
            </header>

            <form onSubmit={handleSubmit} className="inquiry-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="fromDestination" className="form-label">From</label>
                  <input
                    id="fromDestination"
                    type="text"
                    name="fromDestination"
                    placeholder="Pick-up location"
                    value={form.fromDestination}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="toDestination" className="form-label">To</label>
                  <input
                    id="toDestination"
                    type="text"
                    name="toDestination"
                    placeholder="Drop-off location"
                    value={form.toDestination}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Additional instructions <span className="form-label-optional">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Any special requests, pickup time, luggage, etc."
                  value={form.notes}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  rows={3}
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="form-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <button type="submit" disabled={loading} className="form-submit form-submit-with-loader">
                {loading ? (
                  <>
                    <span className="form-spinner" aria-hidden />
                    <span>Sending…</span>
                  </>
                ) : (
                  "Submit inquiry"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryForm;

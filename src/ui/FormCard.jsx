export default function FormCard({ title, children, onSubmit, submitLabel = "Save" }) {
  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <h2>{title}</h2>
      <div className="form-grid">{children}</div>
      <button className="primary" type="submit">{submitLabel}</button>
    </form>
  );
}

export function Input({ label, ...props }) {
  return (
    <label>
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label>
      <span>{label}</span>
      <select {...props}>{children}</select>
    </label>
  );
}

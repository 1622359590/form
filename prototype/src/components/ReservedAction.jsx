import { useState } from "react";

export function ReservedAction({ children, variant = "primary" }) {
  const [isAnnounced, setIsAnnounced] = useState(false);

  return (
    <span className="reserved-action-wrap">
      <button
        className={`button button--${variant}`}
        type="button"
        onClick={() => setIsAnnounced(true)}
      >
        {children}
      </button>
      {isAnnounced ? (
        <span className="reserved-action-status" role="status">
          Coming soon
        </span>
      ) : null}
    </span>
  );
}

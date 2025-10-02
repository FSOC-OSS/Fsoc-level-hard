 return (
    <div
      className={`badge ${badge.earned ? 'earned' : 'locked'}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      tabIndex={0}
      aria-label={`${badge.name} badge ${badge.earned ? 'earned' : 'locked'}`}
    >
      <img
        src={badge.icon}
        alt={`${badge.name} icon`}
        className="badge-icon"
      />
      {!badge.earned && badge.progress && (
        <div className="progress-overlay">
          <svg className="progress-ring" width="60" height="60">
            <circle
              className="progress-ring__circle"
              stroke="#4caf50"
              strokeWidth="4"
              fill="transparent"
              r="26"
              cx="30"
              cy="30"
              strokeDasharray={2 * Math.PI * 26}
              strokeDashoffset={2 * Math.PI * 26 * (1 - badge.progress.current / badge.progress.total)}
            />
          </svg>
          <div className="progress-text">
            {badge.progress.current}/{badge.progress.total}
          </div>
        </div>
      )}
      {hover && (
        <div className="tooltip" role="tooltip" aria-live="polite">
          <strong>{badge.name}</strong>
          <p>{badge.description}</p>
          {badge.earned && <small>Earned</small>}
          {!badge.earned && badge.progress && (
            <small>Progress: {badge.progress.current} of {badge.progress.total}</small>
          )}
        </div>
      )}
    </div>
  );
};

const BadgeCollection = () => {
  return (
    <section className="badge-collection" aria-label="Achievement badges">
      {BADGES.map((badge) => (
        <Badge key={badge.id} badge={badge} />
      ))}
    </section>
  );
};

export default BadgeCollection;

import React from 'react';

const ResetBadgesButton = ({ onReset }) => {
  return (
    <button className="reset-badges-button" onClick={onReset} aria-label="Reset all badges">
      Reset All Badges
    </button>
  );
};

export default ResetBadgesButton;

import React, { useEffect } from 'react';

const BadgeNotification = ({ badge, onClose }) => {
  // Auto close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="badge-notification" role="alert" aria-live="assertive">
      <img
        src={badge.icon}
        alt={`${badge.name} badge icon`}
        className="badge-notification-icon"
      />
      <div className="badge-notification-content">
        <strong>New Badge Earned</strong>
        <p>{badge.name}</p>
      </div>
      <button
        aria-label="Close notification"
        className="badge-notification-close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default BadgeNotification;
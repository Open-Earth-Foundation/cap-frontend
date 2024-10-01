import React from 'react';
import './RiskDetailModal.css';

const RiskDetailModal = ({ risk, onClose }) => {
  if (!risk) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{risk['Climate Threat']}</h2>
        <p><strong>Sector:</strong> {risk['Strategic Sector']}</p>
        <p><strong>Risk Score:</strong> {risk['Risk Score'].toFixed(2)}</p>
        <p><strong>Risk Level:</strong> {risk['Risk Level']}</p>
        <p><strong>Climate Threat Score:</strong> {risk['Climate Threat Score'].toFixed(2)}</p>
        <p><strong>Exposure Score:</strong> {risk['Exposure Score'].toFixed(2)}</p>
        <p><strong>Sensitivity Score:</strong> {risk['Sensitivity Score'].toFixed(2)}</p>
        <p><strong>Adaptive Capacity:</strong> {risk['Adaptive Capacity'].toFixed(2)}</p>
        <p><strong>Vulnerability Score:</strong> {risk['Vulnerability Score'].toFixed(2)}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RiskDetailModal;
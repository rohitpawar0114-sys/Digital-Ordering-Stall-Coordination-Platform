import React from 'react';

const InfoCard = ({ title, value, icon, color = 'orange', trend = null }) => {
    return (
        <div className="stat-card p-4 h-100 fade-in">
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <h2 className="fw-bold mb-0" style={{ letterSpacing: '-1px' }}>{value}</h2>
                    <p className="text-muted small fw-semibold text-uppercase mt-1 mb-0" style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                        {title}
                    </p>
                    {trend && (
                        <div className={`d-flex align-items-center mt-2 ${trend.startsWith('+') ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.75rem' }}>
                            <span className="bg-light rounded-pill px-2 py-1 fw-bold">
                                <i className={`bi bi-arrow-${trend.startsWith('+') ? 'up' : 'down'}-short me-1`}></i>
                                {trend}%
                            </span>
                            <span className="ms-2 text-muted fw-normal">since last week</span>
                        </div>
                    )}
                </div>
                <div className={`bg-${color} bg-opacity-10 d-flex align-items-center justify-content-center rounded-4`} style={{ width: '56px', height: '56px' }}>
                    <i className={`bi bi-${icon} fs-3 text-${color}`}></i>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;

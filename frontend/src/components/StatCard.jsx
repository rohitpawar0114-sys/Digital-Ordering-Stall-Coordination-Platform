import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className="card border-0 shadow-premium rounded-4 h-100 hover-lift transition-all">
            <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className={`bg-${color} bg-opacity-10 p-3 rounded-4 shadow-sm`}>
                        <i className={`bi bi-${icon} fs-4 text-${color}`}></i>
                    </div>
                </div>
                <h6 className="text-muted mb-1 small fw-bold text-uppercase tracking-wider">{title}</h6>
                <h2 className="fw-bold mb-0">{value}</h2>
            </div>
        </div>
    );
};

export default StatCard;

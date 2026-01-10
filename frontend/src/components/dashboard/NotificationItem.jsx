import React from 'react';

const NotificationItem = ({ note }) => {
  // Logic to pick icon and color based on type
  const getStyle = (type) => {
    switch(type) {
      case 'urgent': 
        return { 
          icon: '🚨', 
          class: 'border-danger bg-danger-subtle',
          titleColor: 'text-danger' 
        };
      case 'warning': 
        return { 
          icon: '⚠️', 
          class: 'border-warning bg-warning-subtle',
          titleColor: 'text-warning-emphasis' 
        };
      default: 
        return { 
          icon: 'ℹ️', 
          class: 'border-primary bg-primary-subtle',
          titleColor: 'text-primary' 
        };
    }
  };

  const style = getStyle(note.type);

  return (
    <div className={`card mb-3 border-0 border-start border-5 shadow-sm ${style.class}`} style={{ transition: '0.3s' }}>
      <div className="card-body d-flex align-items-start p-3">
        <div className="fs-3 me-3 mt-1">{style.icon}</div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className={`fw-bold mb-1 ${style.titleColor}`}>{note.title}</h6>
            <span className="badge bg-white text-muted border fw-normal" style={{ fontSize: '10px' }}>
                {note.time}
            </span>
          </div>
          <p className="small mb-0 text-dark opacity-75">{note.message}</p>
        </div>
        
        {/* Unread Indicator Dot */}
        {!note.read && (
          <div className="ms-3 mt-2">
            <div className="rounded-circle bg-primary shadow-sm" style={{width: '10px', height: '10px'}}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
import React from 'react';

const NotificationItem = ({ note }) => {
  // Logic to pick icon and color based on type
  const getStyle = (type) => {
    switch(type) {
      case 'urgent': return { icon: '🚨', class: 'border-danger bg-light-danger' };
      case 'warning': return { icon: '⚠️', class: 'border-warning bg-light-warning' };
      default: return { icon: 'ℹ️', class: 'border-primary bg-light-primary' };
    }
  };

  const style = getStyle(note.type);

  return (
    <div className={`card mb-3 border-0 border-start border-4 shadow-sm ${style.class}`}>
      <div className="card-body d-flex align-items-center">
        <div className="fs-3 me-3">{style.icon}</div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between">
            <h6 className="fw-bold mb-1">{note.title}</h6>
            <small className="text-muted">{note.time}</small>
          </div>
          <p className="small mb-0 text-secondary">{note.message}</p>
        </div>
        {!note.read && <div className="ms-3 rounded-circle bg-primary" style={{width: '10px', height: '10px'}}></div>}
      </div>
    </div>
  );
};

export default NotificationItem;
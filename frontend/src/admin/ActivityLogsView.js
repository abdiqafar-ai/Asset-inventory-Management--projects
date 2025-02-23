import React from "react";

const ActivityLogsView = ({ data }) => {
  return (
    <div className="card">
      <h2 className="card-title">Activity Logs</h2>
      <ul className="list">
        {data.map((log) => (
          <li key={log.id} className="list-item">
            {log.id} - {log.activity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLogsView;

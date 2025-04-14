import { useState } from 'react';

export default function Preferences() {
  const [snoozeDuration, setSnoozeDuration] = useState('Custom');
  const [snoozeTime, setSnoozeTime] = useState('04/15/2025 03:30 PM');
  const [groupByApp, setGroupByApp] = useState(true);
  const [selected, setSelected]: any[] = useState([]);

  const options = ['LMS System', 'TechByte', 'SaaS App1', 'SaaS App2'];
  
  const isAllSelected = selected.length === options.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected([...options]);
    }
  };

  const handleOptionChange = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item: any) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };
  return (
    <div className="notification-preferences">
      <h4>My Notification Preferences</h4>
      <div className="preference-section">
        <label>Mute Notification</label>
        <div className="app-list">
          <div className="form-check">
            <input
              type="checkbox"
              id="selectAll"
              className="form-check-input"
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
            <label className="form-check-label" htmlFor="selectAll">
              Select All
            </label>
          </div>
          {options.map((option) => (
          <div className="form-check" key={option}>
            <input
              type="checkbox"
              id={option}
              className="form-check-input"
              checked={selected.includes(option)}
              onChange={() => handleOptionChange(option)}
            />
            <label className="form-check-label" htmlFor={option}>
              {option}
            </label>
          </div>
        ))}
        </div>
      </div>
      <div className="preference-section">
        <label>Snooze Notification for</label>
        <select
          value={snoozeDuration}
          onChange={(e) => setSnoozeDuration(e.target.value)}
        >
          <option value="Custom">Custom</option>
          <option value="10 mins">10 mins</option>
          <option value="30 mins">30 mins</option>
          <option value="45 mins">45 mins</option>
          <option value="1 hour">1 hour</option>
        </select>
        <input
          type="datetime-local"
          value={snoozeTime}
          onChange={(e) => setSnoozeTime(e.target.value)}
          disabled={snoozeDuration !== 'Custom'}
        />
        <span className="other-options">Other Options: 10 mins, 30 mins, 45 mins, 1 hour</span>
      </div>
      <div className="preference-section">
        <label>
          <input
            type="checkbox"
            checked={groupByApp}
            onChange={() => setGroupByApp(!groupByApp)}
          />
          Group Notifications by App
        </label>
      </div>
    </div>
  )
}

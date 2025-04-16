import { useState } from 'react';
import Select from 'react-select';

export default function Preferences() {
  const [snoozeDuration, setSnoozeDuration] = useState('Custom');
  const [snoozeTime, setSnoozeTime] = useState('04/15/2025 03:30 PM');
  const [groupByApp, setGroupByApp] = useState(true);
  const [muteNotification, setMuteNotification] = useState('custom');
  // @ts-ignore
  const [selectedNotificationTypes, setSelectedNotificationTypes]: any = useState([]);

  const options = [
    { label: 'LMS System', value: 'lms-system' },
    { label: 'TechByte', value: 'tech-byte' },
    { label: 'SaaS App1', value: 'saas-app1' },
    { label: 'SaaS App2', value: 'saas-app2' }
  ];
  
  const onChange = (e: any) => {    
    setSelectedNotificationTypes(e)
  }

  return (
    <div className="notification-preferences">
      <h4>My Notification Preferences</h4>
      <div className="preference-section">
        <label htmlFor='mute-notification'>Mute Notification</label>
        <div className="ms-4" id="mute-notification">
          <select
            className='mb-2'
            value={muteNotification}
            onChange={(e) => setMuteNotification(e.target.value)}
          >
            <option value="custom">Custom</option>
            <option value="no">No</option>
            <option value="all">All</option>
          </select>
          {muteNotification === 'custom' && <Select
            closeMenuOnSelect={false}
            isMulti
            options={options}
            onChange={onChange}
          />}
        </div>
      </div>
      <div className="preference-section">
        <label>Snooze Notification for</label>
        <select
          className='ms-4'
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
      </div>
      <div className='d-flex'>
        <label className="form-check-label me-2" htmlFor="isGroupCheckbox">
          Group Notification by App
        </label>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="isGroupCheckbox"
            checked={groupByApp}
            onChange={() => setGroupByApp(!groupByApp)}
          />
        </div>
      </div>
    </div>
  )
}

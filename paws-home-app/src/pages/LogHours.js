import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function LogHours({currentUserId}) {
  const [formData, setFormData] = useState({
    date: '',
    hours: '',
    assignment: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/log_hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          volunteer_id: currentUserId, 
          hours: parseFloat(formData.hours),
          assignment_type: formData.assignment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log hours');
      }

      const result = await response.json();
      alert(`Your hours have been logged! Log ID: ${result.log_id}`);

      // Reset form
      setFormData({
        date: '',
        hours: '',
        assignment: ''
      });
    } catch (error) {
      console.error('Error logging hours:', error);
      alert('Failed to log hours. Please try again.');
    }
  };


  return (
    <div className="log-hours-page">
      <form className="log-form" onSubmit={handleSubmit}>
        <label htmlFor="date">Date of Service:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="hours">Hours Served:</label>
        <input
          type="number"
          id="hours"
          name="hours"
          min="0.5"
          step="0.5"
          value={formData.hours}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="assignment">Assignment:</label>
        <select
          id="assignment"
          name="assignment"
          value={formData.assignment}
          onChange={handleInputChange}
          required
        >
          <option value="">Select...</option>
          <option value="Dog Care">Dog Care</option>
          <option value="Cat Care">Cat Care</option>
          <option value="Events">Events</option>
          <option value="Administration">Administration</option>
        </select>

        <button className="button" type="submit">Submit Hours</button>
      </form>
    </div>
  );
}

export default LogHours;
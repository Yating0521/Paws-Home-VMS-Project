import React, { useState, useEffect } from 'react';
import '../App.css';

function Schedule({ currentUserId }) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState('');
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    // Reset selected date when month or year changes
    const formattedToday = `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDate(formattedToday);
  }, [year, month]);

  const generateCalendar = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = [];

    let date = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(<td key={`empty-${j}`} className="unavailable"></td>);
        } else if (date > daysInMonth) {
          week.push(<td key={`empty-end-${j}`} className="unavailable"></td>);
        } else {
          const currentDate = new Date(year, month, date);
          const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
          const isPast = currentDate < new Date(today.setHours(0, 0, 0, 0));
          const isSelected = selectedDate === formattedDate;

          week.push(
            <td
              key={`day-${date}`}
              className={`${isPast ? 'unavailable' : 'available'} ${isSelected ? 'selected' : ''}`}
              onClick={!isPast ? () => handleDateSelect(formattedDate) : undefined}
            >
              {date}
            </td>
          );
          date++;
        }
      }
      calendarDays.push(<tr key={`week-${i}`}>{week}</tr>);
    }
    return calendarDays;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shiftTime = document.getElementById('shift-time').value;
    const [startTime, endTime] = shiftTime.split('-');

    try {
      const response = await fetch('http://localhost:5000/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          volunteer_id: currentUserId,
          shift_date: selectedDate,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      alert(`Shift booked for ${selectedDate}, Schedule ID: ${result.schedule_id}`);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting shift:', error);
      alert('Failed to book shift.');
    }
  };

  return (
    <div className="schedule-page">
      <div className="calendar">
        <div className="date-selectors">
          <label htmlFor="month-select">Month:</label>
          <select id="month-select" value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
            {monthNames.map((name, index) => (
              <option key={name} value={index}>{name}</option>
            ))}
          </select>

          <label htmlFor="year-select">Year:</label>
          <select id="year-select" value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <h2 className="month-name">{monthNames[month]} {year}</h2>

        <table>
          <thead>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>{generateCalendar()}</tbody>
        </table>

        <div className="legend">
          <span><span className="box available"></span>Available</span>
          <span><span className="box selected"></span>Selected</span>
          <span><span className="box unavailable"></span>Unavailable</span>
        </div>

        <form className={`shift-form ${showForm ? 'active' : ''}`} onSubmit={handleSubmit}>
          <h3>Book Your Shift</h3>
          <input type="hidden" id="shift-date" value={selectedDate} />
          <label htmlFor="shift-time">Time:</label>
          <select id="shift-time" required>
            <option value="">Select...</option>
            <option value="08:00:00-10:00:00">8am - 10am</option>
            <option value="10:00:00-12:00:00">10am - 12pm</option>
            <option value="13:00:00-15:00:00">1pm - 3pm</option>
            <option value="15:00:00-17:00:00">3pm - 5pm</option>
          </select>
          <button className="button" type="submit">Book Shift</button>
        </form>
      </div>
    </div>
  );
}

export default Schedule;

import React, { useState, useEffect } from 'react';
import './calendar.css';

const Calendar = ({ onDateRangeSelect, onInvalidRange, unavailableDates = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
    const [hoveredDate, setHoveredDate] = useState(null);

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isDateUnavailable = (date) => {
        return unavailableDates.some(range => {
            const rangeStart = new Date(range.startDate);
            const rangeEnd = new Date(range.endDate);
            return date >= rangeStart && date < rangeEnd;
        });
    };

    const isDateInRange = (date) => {
        if (!selectedRange.start) return false;
        if (!selectedRange.end) {
            return date.getTime() === selectedRange.start.getTime();
        }
        return date >= selectedRange.start && date <= selectedRange.end;
    };

    const isDateInHoveredRange = (date) => {
        if (!selectedRange.start || !hoveredDate) return false;
        const start = selectedRange.start;
        const end = hoveredDate;
        const minDate = start < end ? start : end;
        const maxDate = start < end ? end : start;
        return date >= minDate && date <= maxDate;
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );

        // Check if date is unavailable
        if (isDateUnavailable(clickedDate)) {
            return;
        }

        if (!selectedRange.start) {
            setSelectedRange({ start: clickedDate, end: null });
        } else if (!selectedRange.end) {
            if (clickedDate.getTime() === selectedRange.start.getTime()) {
                return;
            }

            const rangeStart = clickedDate < selectedRange.start ? clickedDate : selectedRange.start;
            const rangeEnd = clickedDate > selectedRange.start ? clickedDate : selectedRange.start;
            for (
                const date = new Date(rangeStart);
                date < rangeEnd;
                date.setDate(date.getDate() + 1)
            ) {
                if (isDateUnavailable(date)) {
                    onInvalidRange?.();
                    setSelectedRange({ start: clickedDate, end: null });
                    return;
                }
            }

            if (clickedDate < selectedRange.start) {
                const range = { start: clickedDate, end: selectedRange.start };
                setSelectedRange(range);
                onDateRangeSelect(range);
            } else {
                const range = { start: selectedRange.start, end: clickedDate };
                setSelectedRange(range);
                onDateRangeSelect(range);
            }
        } else {
            setSelectedRange({ start: clickedDate, end: null });
        }
    };

    const handleMonthChange = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
        setSelectedRange({ start: null, end: null });
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );

            const isToday = new Date().toDateString() === date.toDateString();
            const isUnavailable = isDateUnavailable(date);
            const isSelected = isDateInRange(date);
            const isHovered = isDateInHoveredRange(date);
            const isFutureDate = date >= new Date();

            let dayClass = 'calendar-day';
            if (isToday) dayClass += ' today';
            if (isUnavailable) dayClass += ' unavailable';
            if (isSelected) dayClass += ' selected';
            if (isHovered) dayClass += ' hovered';
            if (!isFutureDate) dayClass += ' past';

            days.push(
                <button
                    type="button"
                    key={day}
                    className={dayClass}
                    disabled={!isFutureDate || isUnavailable}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => setHoveredDate(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    title={isUnavailable ? 'Not available' : ''}
                    aria-label={`${date.toLocaleDateString()}${isUnavailable ? ', unavailable' : ''}`}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => handleMonthChange(-1)}
                    aria-label="Previous month"
                >
                    ←
                </button>
                <h3>
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => handleMonthChange(1)}
                    aria-label="Next month"
                >
                    →
                </button>
            </div>

            <div className="calendar-weekdays">
                <div className="calendar-weekday">Sun</div>
                <div className="calendar-weekday">Mon</div>
                <div className="calendar-weekday">Tue</div>
                <div className="calendar-weekday">Wed</div>
                <div className="calendar-weekday">Thu</div>
                <div className="calendar-weekday">Fri</div>
                <div className="calendar-weekday">Sat</div>
            </div>

            <div className="calendar-grid">
                {renderCalendarDays()}
            </div>

            <div className="calendar-legend">
                <div className="legend-item">
                    <div className="legend-color today"></div>
                    <span>Today</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color selected"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color unavailable"></div>
                    <span>Unavailable</span>
                </div>
            </div>

            {selectedRange.start && selectedRange.end && (
                <div className="calendar-selected-dates">
                    <p>
                        Loan: {selectedRange.start.toLocaleDateString()} to {selectedRange.end.toLocaleDateString()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Calendar;

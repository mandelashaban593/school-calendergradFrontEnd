import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const LessonCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/lesscalendlist');
            console.log("Lesson calender records",response.data.data);

            let lessons = [];

            if (Array.isArray(response.data.data)) {
                console.log("inside array if statement");
                // If response.data is already an array
                lessons = response.data.data.map(lesson => ({
                    id: lesson.id,
                    title: lesson.title,
                    start: new Date(`${lesson.weekday} ${lesson.start_time}`),
                    end: new Date(`${lesson.weekday} ${lesson.end_time}`),
                    lessonDetails: {
                        subject_name: lesson.subject_name,
                        start_time: lesson.start_time,
                        end_time: lesson.end_time,
                        teacher: lesson.teacher,
                        room: lesson.room,
                        school_year: lesson.school_year,
                        term: lesson.term,
                        class_size: lesson.class_size
                    }
                }));
            } else {
                console.error('Invalid data structure:', response.data);
                return;
            }

            setEvents(lessons);
        } catch (error) {
            console.error('Failed to fetch lessons:', error);
        }
    };

    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: '#3174ad', // Example: Change background color
            color: 'white', // Example: Change text color
            borderRadius: '0px',
            border: 'none',
            textAlign: 'left',
            fontSize: '12px',
            padding: '3px',
            cursor: 'pointer',
        };
        return {
            style: style
        };
    };

    const CustomEventComponent = ({ event }) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <strong style={{ fontSize: '14px' }}>{event.title}</strong>
            <div style={{ fontSize: '12px' }}>
                {moment(event.start).format('YYYY-MM-DD HH:mm')} - {moment(event.end).format('YYYY-MM-DD HH:mm')}
            </div>
            <div style={{ fontSize: '12px', marginTop: '3px' }}>
                Subject: {event.lessonDetails.subject_name}
            </div>
            <div style={{ fontSize: '12px' }}>
                Start Time: {moment(event.lessonDetails.start_time, 'HH:mm:ss').format('HH:mm')}
            </div>
            <div style={{ fontSize: '12px' }}>
                End Time: {moment(event.lessonDetails.end_time, 'HH:mm:ss').format('HH:mm')}
            </div>
            <div style={{ fontSize: '12px' }}>
                Teacher: {event.lessonDetails.teacher}
            </div>
            <div style={{ fontSize: '12px' }}>
                Room: {event.lessonDetails.room}
            </div>
            <div style={{ fontSize: '12px' }}>
                School Year: {moment(event.lessonDetails.school_year).format('YYYY')}
            </div>
            <div style={{ fontSize: '12px' }}>
                Term: {event.lessonDetails.term}
            </div>
            <div style={{ fontSize: '12px' }}>
                Class Size: {event.lessonDetails.class_size}
            </div>
        </div>
    );

    return (
        <div style={{ height: 800 }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day']}
                defaultView="month"
                eventPropGetter={eventStyleGetter}
                components={{ event: CustomEventComponent }}
                style={{ marginBottom: '20px' }}
            />
        </div>
    );
};

export default LessonCalendar;

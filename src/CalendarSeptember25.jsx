import { useState, useEffect } from "react";
import CalendarNavigation from "./components/CalendarNavigation";
import CalendarLegend from "./components/CalendarLegend";
import TimeSlot from "./components/TimeSlot";
import {
  generateTimeSlots,
  getDaysToShow,
  formatDate,
  getDateRangeTitle,
} from "./utils/calendarUtils";

const CalendarSeptember25 = ({
  view = "week",
  startDate = new Date(2025, 8, 1),
  schedule = [],
  lessons = [],
  onSlotSelect,
}) => {
  const [currentView, setCurrentView] = useState(view);
  const [selectedDate, setSelectedDate] = useState(startDate);

  // Моковые данные согласно ТЗ
  const mockSchedule = [
    {
      startTime: "2025-09-01T09:00:00+00:00",
      endTime: "2025-09-01T18:00:00+00:00",
    },
    {
      startTime: "2025-09-02T09:00:00+00:00",
      endTime: "2025-09-02T18:00:00+00:00",
    },
    {
      startTime: "2025-09-03T09:00:00+00:00",
      endTime: "2025-09-03T18:00:00+00:00",
    },
    {
      startTime: "2025-09-04T09:00:00+00:00",
      endTime: "2025-09-04T18:00:00+00:00",
    },
    {
      startTime: "2025-09-05T09:00:00+00:00",
      endTime: "2025-09-05T18:00:00+00:00",
    },
    {
      startTime: "2025-09-07T07:00:00+00:00",
      endTime: "2025-09-07T11:00:00+00:00",
    },
  ];

  const mockLessons = [
    {
      id: 1,
      duration: 60,
      startTime: "2025-09-01T09:30:00+00:00",
      endTime: "2025-09-01T10:29:59+00:00",
      student: "Алексей Петров",
    },
    {
      id: 2,
      duration: 90,
      startTime: "2025-09-01T11:00:00+00:00",
      endTime: "2025-09-01T12:29:59+00:00",
      student: "Мария Иванова",
    },
    {
      id: 3,
      duration: 30,
      startTime: "2025-09-02T10:00:00+00:00",
      endTime: "2025-09-02T10:29:59+00:00",
      student: "Иван Сидоров",
    },
    {
      id: 4,
      duration: 150,
      startTime: "2025-09-07T07:00:00+00:00",
      endTime: "2025-09-07T09:29:59+00:00",
      student: "Овен Оситров",
    },
  ];

  // Используем переданные данные или моки по умолчанию
  const currentSchedule = schedule.length > 0 ? schedule : mockSchedule;
  const currentLessons = lessons.length > 0 ? lessons : mockLessons;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentView("day");
      } else if (window.innerWidth < 1024) {
        setCurrentView("three-day");
      } else {
        setCurrentView("week");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Навигация: переключение периодов
  const navigatePeriod = (direction) => {
    const newDate = new Date(selectedDate);

    switch (currentView) {
      case "day": {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      }
      case "three-day": {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 3 : -3));
        break;
      }
      case "week": {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      }
      default: {
        break;
      }
    }

    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date(2025, 8, 1));
  };

  const timeSlots = generateTimeSlots();
  const daysToShow = getDaysToShow(selectedDate, currentView);
  const dateRangeTitle = getDateRangeTitle(daysToShow);

  // Проверка, находится ли временной слот в рабочее время учителя
  const isTimeInSchedule = (date, timeSlot) => {
    const slotStart = new Date(date);
    slotStart.setHours(timeSlot.hours, timeSlot.minutes, 0, 0);

    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    return currentSchedule.some((slot) => {
      const scheduleStart = new Date(slot.startTime);
      const scheduleEnd = new Date(slot.endTime);

      return slotStart >= scheduleStart && slotEnd <= scheduleEnd;
    });
  };

  // Поиск занятия в данном слоте
  const getLessonForSlot = (date, timeSlot) => {
    const slotStart = new Date(date);
    slotStart.setHours(timeSlot.hours, timeSlot.minutes, 0, 0);

    return currentLessons.find((lesson) => {
      const lessonStart = new Date(lesson.startTime);
      const lessonEnd = new Date(lesson.endTime);

      return slotStart >= lessonStart && slotStart < lessonEnd;
    });
  };

  // Проверка, является ли это первым слотом занятия
  const isFirstSlotOfLesson = (date, timeSlot, lesson) => {
    if (!lesson) return false;

    const lessonDate = new Date(lesson.startTime);
    return (
      lessonDate.getHours() === timeSlot.hours &&
      lessonDate.getMinutes() === timeSlot.minutes &&
      new Date(date).toDateString() === lessonDate.toDateString()
    );
  };

  // Получение количества слотов для занятия
  const getLessonSlotsCount = (duration) => {
    return Math.ceil(duration / 30);
  };

  // Получение позиции занятия в гриде
  const getLessonGridPosition = (date, timeSlot, lesson) => {
    if (!lesson) return null;

    const lessonDate = new Date(lesson.startTime);
    const dayIndex = daysToShow.findIndex(
      (d) => d.toDateString() === date.toDateString()
    );

    const timeIndex = timeSlots.findIndex(
      (ts) => ts.hours === timeSlot.hours && ts.minutes === timeSlot.minutes
    );

    if (dayIndex === -1 || timeIndex === -1) return null;

    const slotsCount = getLessonSlotsCount(lesson.duration);

    return {
      gridRow: `${timeIndex + 2} / span ${slotsCount}`,
      gridColumn: dayIndex + 2,
    };
  };

  // Обработчик клика по слоту
  const handleSlotClick = (date, timeSlot) => {
    const lesson = getLessonForSlot(date, timeSlot);
    const isWorkingHour = isTimeInSchedule(date, timeSlot);
    const slotStart = new Date(date);
    slotStart.setHours(timeSlot.hours, timeSlot.minutes, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    if (onSlotSelect) {
      onSlotSelect({ startTime: slotStart, endTime: slotEnd });
    } else if (lesson) {
      const lessonStart = new Date(lesson.startTime);
      const lessonEnd = new Date(lesson.endTime);

      alert(
        `Ученик: ${
          lesson.student
        }\nВремя: ${lessonStart.toLocaleTimeString()} - ${lessonEnd.toLocaleTimeString()}\nДлительность: ${
          lesson.duration
        } мин.`
      );
    } else if (isWorkingHour) {
      alert(`Свободный слот: ${slotStart.toLocaleTimeString()}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <CalendarNavigation
        onNavigate={navigatePeriod}
        onToday={goToToday}
        currentView={currentView}
        onViewChange={setCurrentView}
        dateRangeTitle={dateRangeTitle}
      />

      <div className="overflow-x-auto">
        <div
          className="grid gap-1 relative"
          style={{
            gridTemplateColumns: `70px repeat(${daysToShow.length}, minmax(100px, 1fr))`,
          }}
        >
          {/* Заголовок с временами */}
          <div className="bg-gray-100 p-2 rounded text-center font-semibold">
            Время
          </div>

          {/* Заголовки дней */}
          {daysToShow.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="bg-gray-100 p-2 rounded text-center font-semibold"
            >
              {formatDate(day)}
            </div>
          ))}

          {/* Временные метки */}
          {timeSlots.map((timeSlot, timeIndex) => (
            <div
              key={`time-${timeIndex}`}
              className="bg-gray-50 p-2 text-xs text-gray-600 text-center"
              style={{
                gridRow: timeIndex + 2,
                gridColumn: 1,
              }}
            >
              {timeSlot.formatted}
            </div>
          ))}

          {/* Ячейки календаря */}
          {timeSlots.map((timeSlot, timeIndex) =>
            daysToShow.map((day, dayIndex) => {
              const lesson = getLessonForSlot(day, timeSlot);
              const isWorkingHour = isTimeInSchedule(day, timeSlot);
              const isFirstSlot = isFirstSlotOfLesson(day, timeSlot, lesson);
              const gridPosition = getLessonGridPosition(day, timeSlot, lesson);

              if (lesson && !isFirstSlot) {
                return null;
              }

              return (
                <TimeSlot
                  key={`slot-${dayIndex}-${timeIndex}`}
                  timeSlot={timeSlot}
                  day={day}
                  isWorkingHour={isWorkingHour}
                  lesson={lesson}
                  isFirstSlot={isFirstSlot}
                  gridPosition={
                    gridPosition || {
                      gridRow: timeIndex + 2,
                      gridColumn: dayIndex + 2,
                    }
                  }
                  onSlotClick={handleSlotClick}
                />
              );
            })
          )}
        </div>
      </div>

      <CalendarLegend />
    </div>
  );
};

export default CalendarSeptember25;

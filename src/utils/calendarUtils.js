// utils/calendarUtils.js

// Генерация временных слотов (30 минут интервалы с 8:00 до 21:30)
export const generateTimeSlots = () => {
  return Array.from({ length: 28 }, (_, i) => {
    const hours = Math.floor(i / 2) + 8;
    const minutes = (i % 2) * 30;
    return {
      hours,
      minutes,
      index: i,
      formatted: `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`,
    };
  });
};

// Получение дней для отображения в зависимости от выбранного вида
export const getDaysToShow = (selectedDate, currentView) => {
  const startDate = new Date(selectedDate);

  switch (currentView) {
    case "day": {
      return [startDate];
    }

    case "three-day": {
      return Array.from({ length: 3 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date;
      });
    }

    case "week": {
      const monday = new Date(startDate);
      const dayOfWeek = monday.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      monday.setDate(monday.getDate() + diff);

      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
      });
    }

    default: {
      return [startDate];
    }
  }
};

// Форматирование даты для отображения
export const formatDate = (date) => {
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// Форматирование заголовка диапазона дат
export const getDateRangeTitle = (daysToShow) => {
  if (daysToShow.length === 0) return "";

  if (daysToShow.length === 1) {
    return daysToShow[0].toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const firstDate = daysToShow[0];
  const lastDate = daysToShow[daysToShow.length - 1];

  if (firstDate.getMonth() === lastDate.getMonth()) {
    return `${firstDate.getDate()} - ${lastDate.getDate()} ${firstDate.toLocaleDateString(
      "ru-RU",
      { month: "long" }
    )} ${firstDate.getFullYear()}`;
  } else {
    return `${firstDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    })} - ${lastDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }
};

// Проверка рабочего времени (9:00-18:00)
export const isInWorkingHours = (timeSlot) => {
  const totalMinutes = timeSlot.hours * 60 + timeSlot.minutes;
  return totalMinutes >= 9 * 60 && totalMinutes < 18 * 60;
};

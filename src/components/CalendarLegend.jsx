const CalendarLegend = () => {
  return (
    <div className="mt-6 flex gap-4 text-sm justify-center">
      {/* Легенда для занятий */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-200 rounded"></div>
        <span className="text-gray-700">Занятие</span>
      </div>

      {/* Легенда для свободных слотов */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-100 rounded"></div>
        <span className="text-gray-700">Свободный слот</span>
      </div>

      {/* Легенда для нерабочего времени */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-50 rounded border"></div>
        <span className="text-gray-700">Не рабочее время</span>
      </div>
    </div>
  );
};

export default CalendarLegend;

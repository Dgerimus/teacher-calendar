// components/TimeSlot.jsx
const TimeSlot = ({
  timeSlot,
  day,
  isWorkingHour,
  lesson,
  isFirstSlot,
  gridPosition,
  onSlotClick,
  timeIndex,
  dayIndex,
}) => {
  // Определяем скругление углов только для первого слота занятия
  const getBorderRadius = () => {
    if (!lesson) return "";
    if (isFirstSlot) return "rounded-lg";
    return "";
  };

  // Определяем классы в зависимости от типа слота
  const getSlotClasses = () => {
    if (lesson) {
      return "bg-red-200 hover:bg-red-300 cursor-pointer";
    } else if (isWorkingHour) {
      return "bg-green-100 hover:bg-green-200 cursor-pointer";
    } else {
      return "bg-gray-50 cursor-not-allowed";
    }
  };

  // Если нет gridPosition, используем стандартное положение
  const gridStyle = gridPosition || {
    gridRow: timeIndex + 2,
    gridColumn: dayIndex + 2,
  };

  return (
    <div
      onClick={() => isWorkingHour && onSlotClick(day, timeSlot)}
      className={`
        p-1 border min-h-[40px] transition-colors relative
        flex items-center justify-center
        ${getSlotClasses()}
        ${getBorderRadius()}
      `}
      style={gridStyle}
    >
      {/* Показываем информацию только для первого слота занятия */}
      {isFirstSlot && (
        <div className="text-xs text-center leading-tight">
          <div className="font-semibold truncate max-w-[80px]">
            {lesson.title}
          </div>
          <div className="text-gray-600 text-[11px] mt-0.5">
            {lesson.duration} мин
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlot;

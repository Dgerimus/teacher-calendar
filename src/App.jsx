import {} from "react";

import "./App.css";
import CalendarSeptember25 from "./CalendarSeptember25";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Teacher's Schedule Calendar
          </h1>
        </div>

        <CalendarSeptember25 />
      </div>
    </div>
  );
}

export default App;

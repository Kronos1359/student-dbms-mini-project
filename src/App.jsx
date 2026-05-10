import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentsList from "./pages/StudentsList";
import StudentDetails from "./pages/StudentDetails";
import StudentData from "./pages/StudentData";
import MarksList from "./pages/MarksList";
import StudentMarks from "./pages/StudentMarks";
import AttendanceList from "./pages/AttendanceList";
import StudentAttendance from "./pages/StudentAttendance";
import StudentMarksView from "./pages/StudentMarksView";
import StudentAttendanceView from "./pages/StudentAttendanceView";


const basename =
  import.meta.env.MODE === "production"
    ? "/student-dbms-mini-project"
    : "/";


function App() {

  return (

    <BrowserRouter basename={basename}>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* TEACHER */}

        <Route
          path="/teacher"
          element={<TeacherDashboard />}
        />

        <Route
          path="/students"
          element={<StudentsList />}
        />

        <Route
          path="/student/:id"
          element={<StudentDetails />}
        />

        <Route
          path="/marks-list"
          element={<MarksList />}
        />

        <Route
          path="/student-marks/:id"
          element={<StudentMarks />}
        />

        <Route
          path="/attendance-list"
          element={<AttendanceList />}
        />

        <Route
          path="/student-attendance/:id"
          element={<StudentAttendance />}
        />

        <Route
          path="/student/:id"
          element={<StudentData />}
        />

        {/* STUDENT */}

        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        <Route
          path="/student-marks-view"
          element={<StudentMarksView />}
        />

        <Route
          path="/student-attendance-view"
          element={<StudentAttendanceView />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
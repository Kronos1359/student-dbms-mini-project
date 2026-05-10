import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getDocs,
  collection,
  onSnapshot
} from "firebase/firestore";

function StudentDashboard() {

  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // AUTH + REALTIME DATA SETUP
  useEffect(() => {

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {

      if (!user) return;

      fetchStudent(user.uid);
      setupRealtimeData();
    });

    return () => unsubscribeAuth();

  }, []);

  // GET STUDENT PROFILE
  const fetchStudent = async (uid) => {

    const snapshot = await getDocs(collection(db, "users"));

    snapshot.forEach((docItem) => {

      const data = docItem.data();

      if (data.uid === uid) {
        setStudent(data);
      }
    });
  };

  // REAL-TIME MARKS + ATTENDANCE
  const setupRealtimeData = () => {

    const marksRef = collection(db, "marks");
    const attRef = collection(db, "attendance");

    const unsubMarks = onSnapshot(marksRef, (snapshot) => {

      let data = [];

      snapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setMarks(data);
    });

    const unsubAtt = onSnapshot(attRef, (snapshot) => {

      let data = [];

      snapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setAttendance(data);
    });

    return () => {
      unsubMarks();
      unsubAtt();
    };
  };

  // CALCULATIONS
  const myMarks = marks.filter(m =>
    m.studentId === student?.studentId
  );

  const myAttendance = attendance.filter(a =>
    a.studentId === student?.studentId
  );

  const avgMarks =
    myMarks.length > 0
      ? (myMarks.reduce((a, b) => a + b.marks, 0) / myMarks.length).toFixed(1)
      : 0;

  const attendancePercent =
    myAttendance.length > 0
      ? (myAttendance.reduce((a, b) => a + b.attendancePercentage, 0) / myAttendance.length).toFixed(1)
      : 0;

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (

    <div className="flex">

      {/* SIDEBAR */}
      <div className="w-[250px] bg-blue-900 text-white p-5 min-h-screen">

        <h1 className="text-3xl font-bold mb-10">
          Student Panel
        </h1>

        <div className="flex flex-col gap-4">

          <Link to="/student" className="bg-blue-700 px-4 py-3 rounded-xl hover:bg-blue-600">
            Dashboard
          </Link>

          <Link to="/student-marks-view" className="bg-blue-700 px-4 py-3 rounded-xl hover:bg-blue-600">
            Marks
          </Link>

          <Link to="/student-attendance-view" className="bg-blue-700 px-4 py-3 rounded-xl hover:bg-blue-600">
            Attendance
          </Link>

        </div>

        <button
          onClick={logout}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl"
        >
          Logout
        </button>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-10">

        {/* PROFILE CARD */}
        {student ? (

          <div className="bg-white p-6 rounded-2xl shadow mb-8">

            <h2 className="text-2xl font-bold mb-4">
              My Profile
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Student ID:</strong> {student.studentId}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Department:</strong> {student.department}</p>
              <p><strong>Semester:</strong> {student.semester}</p>
              <p><strong>Section:</strong> {student.section}</p>

            </div>

          </div>

        ) : (
          <p>Loading profile...</p>
        )}

        {/* DASHBOARD CARDS */}
        <h1 className="text-4xl font-bold mb-5">
          Student Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-5">

          <div className="bg-white p-5 rounded-2xl shadow">

            <h2 className="text-xl font-bold">
              Attendance
            </h2>

            <p className="text-3xl mt-4">
              {attendancePercent}%
            </p>

          </div>

          <div className="bg-white p-5 rounded-2xl shadow">

            <h2 className="text-xl font-bold">
              Average Marks
            </h2>

            <p className="text-3xl mt-4">
              {avgMarks}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;
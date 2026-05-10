import TeacherSidebar from "../components/TeacherSidebar";

import { useEffect, useState } from "react";

import { collection, onSnapshot, getDocs } from "firebase/firestore";

import { signOut } from "firebase/auth";

import { auth, db } from "../firebase/firebase";

function TeacherDashboard() {

  const [teacher, setTeacher] = useState(null);

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // FETCH TEACHER PROFILE
  useEffect(() => {

    const fetchTeacher = async () => {

      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const snapshot = await getDocs(collection(db, "users"));

      snapshot.forEach((docItem) => {

        const data = docItem.data();

        if (data.uid === currentUser.uid) {
          setTeacher(data);
        }
      });
    };

    fetchTeacher();

  }, []);

  // REAL-TIME DATA
  useEffect(() => {

    const unsubStudents = onSnapshot(
      collection(db, "users"),
      (snap) => {

        let data = [];
        snap.forEach(d => data.push(d.data()));

        // ✅ ONLY STUDENTS
        setStudents(
          data.filter(user => user.role === "student")
        );
      }
    );

    const unsubMarks = onSnapshot(
      collection(db, "marks"),
      (snap) => {

        let data = [];
        snap.forEach(d => data.push(d.data()));

        setMarks(data);
      }
    );

    const unsubAttendance = onSnapshot(
      collection(db, "attendance"),
      (snap) => {

        let data = [];
        snap.forEach(d => data.push(d.data()));

        setAttendance(data);
      }
    );

    return () => {
      unsubStudents();
      unsubMarks();
      unsubAttendance();
    };

  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      <TeacherSidebar />

      <div className="flex-1 p-10">

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-8">
          Teacher Dashboard
        </h1>

        {/* TEACHER CARD */}
        {teacher && (

          <div className="bg-white p-8 rounded-2xl shadow mb-10">

            <h2 className="text-2xl font-bold mb-5">
              Teacher Details
            </h2>

            <div className="grid grid-cols-2 gap-5">

              <p><strong>Name:</strong> {teacher.name}</p>
              <p><strong>Email:</strong> {teacher.email}</p>
              <p><strong>Department:</strong> {teacher.department}</p>
              <p><strong>Role:</strong> {teacher.role}</p>

            </div>

          </div>

        )}

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-3 gap-5">

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-xl font-bold">
              Students
            </h2>

            <p className="text-3xl mt-3">
              {students.length}
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-xl font-bold">
              Total Marks Entries
            </h2>

            <p className="text-3xl mt-3">
              {marks.length}
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-xl font-bold">
              Attendance Records
            </h2>

            <p className="text-3xl mt-3">
              {attendance.length}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TeacherDashboard;
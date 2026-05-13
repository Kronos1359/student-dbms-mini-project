import {
  useEffect,
  useState
} from "react";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import {
  auth,
  db
} from "../firebase/firebase";

function StudentData() {

  const [student, setStudent] =
    useState(null);

  const [marks, setMarks] =
    useState([]);

  const [attendance, setAttendance] =
    useState([]);

  useEffect(() => {

    fetchStudentData();

  }, []);

  const fetchStudentData = async () => {

    const currentUser =
      auth.currentUser;

    if (!currentUser) return;

    // FIND CURRENT USER

    const usersSnapshot =
      await getDocs(collection(db, "users"));

    let currentStudent = null;

    usersSnapshot.forEach((docItem) => {

      const data = docItem.data();

      if (data.uid === currentUser.uid) {

        currentStudent = data;
      }
    });

    setStudent(currentStudent);

    if (!currentStudent) return;

    // FETCH MARKS

    const marksQuery = query(
      collection(db, "marks"),
      where(
        "studentId",
        "==",
        currentStudent.studentId
      )
    );

    const marksSnapshot =
      await getDocs(marksQuery);

    let marksData = [];

    marksSnapshot.forEach((docItem) => {

      marksData.push(docItem.data());
    });

    setMarks(marksData);

    // FETCH ATTENDANCE

    const attendanceQuery = query(
      collection(db, "attendance"),
      where(
        "studentId",
        "==",
        currentStudent.studentId
      )
    );

    const attendanceSnapshot =
      await getDocs(attendanceQuery);

    let attendanceData = [];

    attendanceSnapshot.forEach((docItem) => {

      attendanceData.push(docItem.data());
    });

    setAttendance(attendanceData);
  };

  // CALCULATE AVERAGE MARKS

  const averageMarks =
    marks.length > 0
      ?
      (
        marks.reduce(
          (total,item)=>
            total + item.marks,
          0
        ) / marks.length
      ).toFixed(1)
      :
      0;

  return (

    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-4xl font-bold mb-5">
        Student Dashboard
      </h1>

      {/* PROFILE */}

      {student && (

        <div className="bg-white p-8 rounded-2xl shadow mb-10">

          <h2 className="text-2xl font-bold mb-5">
            Profile
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <p>
              <strong>Name:</strong>
              {" "}
              {student.name}
            </p>

            <p>
              <strong>Email:</strong>
              {" "}
              {student.email}
            </p>

            <p>
              <strong>Student ID:</strong>
              {" "}
              {student.studentId}
            </p>

            <p>
              <strong>Department:</strong>
              {" "}
              {student.department}
            </p>

            <p>
              <strong>Semester:</strong>
              {" "}
              {student.semester}
            </p>

            <p>
              <strong>Section:</strong>
              {" "}
              {student.section}
            </p>

          </div>

        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-3 gap-5 mb-10">

        <div className="bg-white p-5 rounded-2xl shadow">

          <h2 className="text-xl font-bold">
            Average Marks
          </h2>

          <p className="text-3xl mt-4">
            {averageMarks}
          </p>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow">

          <h2 className="text-xl font-bold">
            Subjects
          </h2>

          <p className="text-3xl mt-4">
            {marks.length}
          </p>

        </div>

        <div className="bg-white p-5 rounded-2xl shadow">

          <h2 className="text-xl font-bold">
            Attendance Records
          </h2>

          <p className="text-3xl mt-4">
            {attendance.length}
          </p>

        </div>

      </div>

      {/* ALERTS */}

      {averageMarks < 40 && (

        <div className="bg-red-200 p-5 rounded-xl mb-10">

          ⚠️ Performance Alert:
          Your average marks are below 40.

        </div>
      )}

      {/* MARKS */}

      <div className="bg-white p-8 rounded-2xl shadow mb-10">

        <h2 className="text-3xl font-bold mb-5">
          Marks
        </h2>

        <div className="space-y-4">

          {marks.map((item,index)=>(

            <div
              key={index}
              className="border p-4 rounded-xl flex justify-between"
            >

              <span>{item.subject}</span>

              <span>{item.marks}</span>

            </div>
          ))}

        </div>

      </div>

      {/* ATTENDANCE */}

      <div className="bg-white p-8 rounded-2xl shadow">

        <h2 className="text-3xl font-bold mb-5">
          Attendance
        </h2>

        <div className="space-y-4">

          {attendance.map((item,index)=>(

            <div
              key={index}
              className="border p-4 rounded-xl flex justify-between"
            >

              <span>{item.subject}</span>

              <span>{item.attendance}%</span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default StudentData;
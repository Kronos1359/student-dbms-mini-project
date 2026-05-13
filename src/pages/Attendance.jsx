import {
  useEffect,
  useState
} from "react";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function Attendance() {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [subject, setSubject] = useState("");
  const [attendance, setAttendance] = useState("");

  const [attendanceList, setAttendanceList] =
    useState([]);

  useEffect(() => {

    fetchStudents();
    fetchAttendance();

  }, []);

  // FETCH ALL STUDENTS

  const fetchStudents = async () => {

    const snapshot =
      await getDocs(collection(db, "users"));

    let studentData = [];

    snapshot.forEach((docItem) => {

      const data = docItem.data();

      if (data.role === "student") {

        studentData.push(data);
      }
    });

    setStudents(studentData);
  };

  // FETCH ATTENDANCE

  const fetchAttendance = async () => {

    const snapshot =
      await getDocs(collection(db, "attendance"));

    let attendanceData = [];

    snapshot.forEach((docItem) => {

      attendanceData.push({
        id: docItem.id,
        ...docItem.data()
      });
    });

    setAttendanceList(attendanceData);
  };

  // SAVE ATTENDANCE

  const saveAttendance = async () => {

    if (!selectedStudent) {
      alert("Select Student");
      return;
    }

    await addDoc(collection(db, "attendance"), {

      studentId: selectedStudent.studentId,
      studentName: selectedStudent.name,
      subject,
      attendance: Number(attendance)

    });

    alert("Attendance Saved");

    fetchAttendance();
  };

  // UPDATE ATTENDANCE

  const updateAttendance = async (id) => {

    const docRef =
      doc(db, "attendance", id);

    const newAttendance =
      prompt("Enter New Attendance");

    await updateDoc(docRef, {

      attendance: Number(newAttendance)

    });

    fetchAttendance();
  };

  // SEARCH FILTER

  const filteredStudents = students.filter(
    (student) =>

      student.name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      student.studentId
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-5">
        Attendance Management
      </h1>

      {/* SEARCH */}

      <input
        className="border p-3 rounded w-full mb-5"
        placeholder="Search Student Name or ID"
        onChange={(e)=>setSearch(e.target.value)}
      />

      {/* STUDENTS LIST */}

      <div className="grid grid-cols-3 gap-5 mb-10">

        {filteredStudents.map((student,index)=>(

          <div
            key={index}
            className={`p-5 rounded-2xl shadow cursor-pointer
            ${
              selectedStudent?.studentId ===
              student.studentId
              ?
              "bg-blue-200"
              :
              "bg-white"
            }`}
            onClick={()=>setSelectedStudent(student)}
          >

            <h2 className="text-xl font-bold">
              {student.name}
            </h2>

            <p>ID: {student.studentId}</p>

            <p>{student.department}</p>

          </div>
        ))}

      </div>

      {/* SELECTED STUDENT */}

      {selectedStudent && (

        <div className="bg-white p-10 rounded-2xl shadow mb-10">

          <h2 className="text-2xl font-bold mb-5">

            Selected:
            {" "}
            {selectedStudent.name}

          </h2>

          <input
            className="border p-3 rounded w-full mb-3"
            placeholder="Subject"
            onChange={(e)=>setSubject(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full mb-3"
            placeholder="Attendance %"
            onChange={(e)=>setAttendance(e.target.value)}
          />

          <button
            onClick={saveAttendance}
            className="bg-black text-white px-5 py-3 rounded"
          >
            Save Attendance
          </button>

        </div>
      )}

      {/* ALL ATTENDANCE */}

      <h2 className="text-3xl font-bold mb-5">
        Attendance Records
      </h2>

      <div className="grid grid-cols-3 gap-5">

        {attendanceList.map((item)=>(

          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl shadow"
          >

            <h2 className="font-bold text-xl">
              {item.studentName}
            </h2>

            <p>ID: {item.studentId}</p>

            <p>Subject: {item.subject}</p>

            <p className="text-2xl mt-2">
              {item.attendance}%
            </p>

            <button
              onClick={()=>updateAttendance(item.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
            >
              Edit Attendance
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Attendance;
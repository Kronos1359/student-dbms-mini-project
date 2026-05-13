import TeacherSidebar from "../components/TeacherSidebar";

import {
  useEffect,
  useState
} from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import {
  useParams,
  Link
} from "react-router-dom";

import { db } from "../firebase/firebase";

function StudentDetails() {

  const { id } = useParams();

  const [student, setStudent] =
    useState(null);

  useEffect(() => {

    fetchStudent();

  }, []);

  const fetchStudent = async () => {

    const snapshot =
      await getDocs(collection(db, "users"));

    snapshot.forEach((docItem) => {

      const data = docItem.data();

      if(data.studentId === id){

        setStudent(data);
      }
    });
  };

  if(!student){

    return (

      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (

    <div className="flex">

      <TeacherSidebar />

      <div className="flex-1 p-10 bg-gray-100">

        <div className="p-10 bg-gray-100 min-h-screen">

          <div className="bg-white p-10 rounded-2xl shadow">

            <h1 className="text-4xl font-bold mb-8">
              {student.name}
            </h1>

            {/* STUDENT DETAILS */}

            <div className="grid grid-cols-2 gap-5 mb-10">

              <p>
                <strong>Student ID:</strong>
                {" "}
                {student.studentId}
              </p>

              <p>
                <strong>Email:</strong>
                {" "}
                {student.email}
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

              <p>
                <strong>Role:</strong>
                {" "}
                {student.role}
              </p>

            </div>

            {/* ACTION BUTTONS */}

            <div className="flex gap-5">

              <Link
                to={`/student-marks/${student.studentId}`}
                className="bg-blue-500 text-white px-5 py-3 rounded"
              >
                Manage Marks
              </Link>

              <Link
                to={`/student-attendance/${student.studentId}`}
                className="bg-green-500 text-white px-5 py-3 rounded"
              >
                Manage Attendance
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDetails;
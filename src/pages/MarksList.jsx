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
  Link
} from "react-router-dom";

import { db } from "../firebase/firebase";

function MarksList() {

  const [students, setStudents] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    const snapshot =
      await getDocs(collection(db,"users"));

    let data = [];

    snapshot.forEach((docItem)=>{

      const user = docItem.data();

      if(user.role === "student"){

        data.push(user);
      }
    });

    setStudents(data);
  };

  const filteredStudents = students.filter(
    (student)=>

      student.name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      student.studentId
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <div className="flex">

      <TeacherSidebar />

      <div className="flex-1 p-10 bg-gray-100">

        <div className="p-10 bg-gray-100 min-h-screen">

          <h1 className="text-4xl font-bold mb-5">
            Marks Management
          </h1>

          <input
            className="border p-3 rounded w-full mb-5"
            placeholder="Search Student"
            onChange={(e)=>setSearch(e.target.value)}
          />

          <div className="bg-white rounded-2xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-blue-900 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Student ID
                  </th>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Department
                  </th>

                  <th className="p-4 text-left">
                    Semester
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredStudents.map((student,index)=>(

                  <tr
                    key={index}
                    className="border-b"
                  >

                    <td className="p-4">
                      {student.studentId}
                    </td>

                    <td className="p-4">
                      {student.name}
                    </td>

                    <td className="p-4">
                      {student.department}
                    </td>

                    <td className="p-4">
                      {student.semester}
                    </td>

                    <td className="p-4">

                      <Link
                        to={`/student-marks/${student.studentId}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Manage Marks
                      </Link>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MarksList;
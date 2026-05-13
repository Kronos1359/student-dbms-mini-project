import { useEffect, useState } from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function Students() {

  const [students, setStudents] = useState([]);

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    const querySnapshot =
      await getDocs(collection(db, "users"));

    let studentList = [];

    querySnapshot.forEach((doc) => {

      const data = doc.data();

      if(data.role === "student"){

        studentList.push(data);
      }
    });

    setStudents(studentList);
  };

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-5">
        All Students
      </h1>

      <div className="grid grid-cols-3 gap-5">

        {students.map((student,index)=>(

          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow"
          >

            <h2 className="text-xl font-bold">
              {student.name}
            </h2>

            <p>{student.email}</p>
            <p>{student.department}</p>
            <p>Semester: {student.semester}</p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Students;
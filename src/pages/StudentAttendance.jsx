import TeacherSidebar from "../components/TeacherSidebar";

import {
  useEffect,
  useState
} from "react";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";

import {
  useParams
} from "react-router-dom";

import { db } from "../firebase/firebase";

function StudentAttendance() {

  const { id } = useParams();

  const [student, setStudent] =
    useState(null);

  const [subject, setSubject] =
    useState("");

  const [attendanceList, setAttendanceList] =
    useState([]);

  useEffect(() => {

    fetchStudent();
    fetchAttendance();

  }, []);

  // FETCH STUDENT

  const fetchStudent = async () => {

    const snapshot =
      await getDocs(collection(db,"users"));

    snapshot.forEach((docItem)=>{

      const data = docItem.data();

      if(data.studentId === id){

        setStudent(data);
      }
    });
  };

  // FETCH ATTENDANCE

  const fetchAttendance = async () => {

    const q = query(
      collection(db,"attendance"),
      where("studentId","==",id)
    );

    const snapshot =
      await getDocs(q);

    let data = [];

    snapshot.forEach((docItem)=>{

      data.push({
        id: docItem.id,
        ...docItem.data()
      });
    });

    setAttendanceList(data);
  };

  // ADD SUBJECT

  const addSubject = async () => {

    if(!subject){

      alert("Enter subject");
      return;
    }

    await addDoc(collection(db,"attendance"),{

      studentId: student.studentId,
      studentName: student.name,

      subject,

      totalClasses: 0,
      attendedClasses: 0,

      attendancePercentage: 0
    });

    setSubject("");

    fetchAttendance();
  };

  // MARK ATTENDANCE

  const markAttendance = async (
    attendanceId,
    status,
    current
  ) => {

    let total =
      current.totalClasses;

    let attended =
      current.attendedClasses;

    if(status === "present"){

      total += 1;
      attended += 1;
    }

    else if(status === "absent"){

      total += 1;
    }

    const percentage =
      total === 0
      ?
      0
      :
      ((attended / total) * 100)
        .toFixed(1);

    await updateDoc(
      doc(db,"attendance",attendanceId),
      {

        totalClasses: total,

        attendedClasses: attended,

        attendancePercentage:
          Number(percentage)
      }
    );

    fetchAttendance();
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

          <h1 className="text-4xl font-bold mb-5">

            Attendance:
            {" "}
            {student.name}

          </h1>

          {/* ADD SUBJECT */}

          <div className="bg-white p-8 rounded-2xl shadow mb-10">

            <h2 className="text-2xl font-bold mb-5">
              Add Subject
            </h2>

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Subject"
              value={subject}
              onChange={(e)=>setSubject(e.target.value)}
            />

            <button
              onClick={addSubject}
              className="bg-green-500 text-white px-5 py-3 rounded"
            >
              Add Subject
            </button>

          </div>

          {/* ATTENDANCE TABLE */}

          <div className="bg-white rounded-2xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-blue-900 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Subject
                  </th>

                  <th className="p-4 text-left">
                    Total Classes
                  </th>

                  <th className="p-4 text-left">
                    Attended
                  </th>

                  <th className="p-4 text-left">
                    Percentage
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {attendanceList.map((item)=>(

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {item.subject}
                    </td>

                    <td className="p-4">
                      {item.totalClasses}
                    </td>

                    <td className="p-4">
                      {item.attendedClasses}
                    </td>

                    <td className="p-4">
                      {item.attendancePercentage}%
                    </td>

                    <td className="p-4 flex gap-2">

                      <button
                        onClick={()=>
                          markAttendance(
                            item.id,
                            "present",
                            item
                          )
                        }
                        className="bg-green-500 text-white px-3 py-2 rounded"
                      >
                        Present
                      </button>

                      <button
                        onClick={()=>
                          markAttendance(
                            item.id,
                            "absent",
                            item
                          )
                        }
                        className="bg-red-500 text-white px-3 py-2 rounded"
                      >
                        Absent
                      </button>

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

export default StudentAttendance;
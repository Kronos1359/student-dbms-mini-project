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

import StudentSidebar from "../components/StudentSidebar";

function StudentAttendanceView() {

  const [attendance,setAttendance] =
    useState([]);

  const [overallPercentage,setOverallPercentage] =
    useState(0);

  useEffect(()=>{

    fetchAttendance();

  },[]);

  const fetchAttendance = async () => {

    const currentUser =
      auth.currentUser;

    if(!currentUser) return;

    // FIND STUDENT

    const usersSnapshot =
      await getDocs(collection(db,"users"));

    let student = null;

    usersSnapshot.forEach((docItem)=>{

      const data = docItem.data();

      if(data.uid === currentUser.uid){

        student = data;
      }
    });

    if(!student) return;

    // FETCH ATTENDANCE

    const q = query(
      collection(db,"attendance"),
      where(
        "studentId",
        "==",
        student.studentId
      )
    );

    const snapshot =
      await getDocs(q);

    let data = [];

    snapshot.forEach((docItem)=>{

      data.push(docItem.data());
    });

    setAttendance(data);

    // CALCULATE OVERALL %

    let totalClasses = 0;

    let attendedClasses = 0;

    data.forEach((item)=>{

    totalClasses += item.totalClasses;

    attendedClasses += item.attendedClasses;
    });

    const overall =

    totalClasses === 0
    ?
    0
    :
    (
        (attendedClasses / totalClasses)
        * 100
    ).toFixed(1);

    setOverallPercentage(overall);
  };

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <StudentSidebar />

      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-5">
          My Attendance
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow mb-8 w-[300px]">

            <h2 className="text-2xl font-bold">
                Overall Attendance
            </h2>

            <p className="text-5xl mt-4 text-green-600 font-bold">

                {overallPercentage}%

            </p>

        </div>

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

              </tr>

            </thead>

            <tbody>

              {attendance.map((item,index)=>(

                <tr
                  key={index}
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

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default StudentAttendanceView;
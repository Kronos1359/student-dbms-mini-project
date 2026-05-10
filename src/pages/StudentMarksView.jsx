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

function StudentMarksView() {

  const [marks,setMarks] =
    useState([]);

  useEffect(()=>{

    fetchMarks();

  },[]);

  const fetchMarks = async () => {

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

    // FETCH MARKS

    const q = query(
      collection(db,"marks"),
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

    setMarks(data);
  };

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <StudentSidebar />

      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-5">
          My Marks
        </h1>

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-900 text-white">

              <tr>

                <th className="p-4 text-left">
                  Subject
                </th>

                <th className="p-4 text-left">
                  Marks
                </th>

              </tr>

            </thead>

            <tbody>

              {marks.map((item,index)=>(

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="p-4">
                    {item.subject}
                  </td>

                  <td className="p-4">
                    {item.marks}
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

export default StudentMarksView;
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
  deleteDoc,
  doc
} from "firebase/firestore";

import {
  useParams
} from "react-router-dom";

import { db } from "../firebase/firebase";

function StudentMarks() {

  const { id } = useParams();

  const [student, setStudent] =
    useState(null);

  const [subject, setSubject] =
    useState("");

  const [marks, setMarks] =
    useState("");

  const [marksList, setMarksList] =
    useState([]);

  useEffect(() => {

    fetchStudent();
    fetchMarks();

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

  // FETCH MARKS

  const fetchMarks = async () => {

    const q = query(
      collection(db,"marks"),
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

    setMarksList(data);
  };

  // SAVE MARKS

  const saveMarks = async () => {

    if(!subject || !marks){

      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db,"marks"),{

      studentId: student.studentId,
      studentName: student.name,
      subject,
      marks: Number(marks)

    });

    setSubject("");
    setMarks("");

    fetchMarks();
  };

  // UPDATE MARKS

  const updateMarks = async (markId) => {

    const newMarks =
      prompt("Enter New Marks");

    if(newMarks === null) return;

    const docRef =
      doc(db,"marks",markId);

    await updateDoc(docRef,{

      marks: Number(newMarks)

    });

    fetchMarks();
  };

  // DELETE MARKS

  const removeMarks = async (markId) => {

    const confirmDelete =
      window.confirm("Delete marks?");

    if(!confirmDelete) return;

    await deleteDoc(
      doc(db,"marks",markId)
    );

    fetchMarks();
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

            Marks:
            {" "}
            {student.name}

          </h1>

          {/* ADD MARKS */}

          <div className="bg-white p-8 rounded-2xl shadow mb-10">

            <h2 className="text-2xl font-bold mb-5">
              Add Marks
            </h2>

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Subject"
              value={subject}
              onChange={(e)=>setSubject(e.target.value)}
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Marks"
              value={marks}
              onChange={(e)=>setMarks(e.target.value)}
            />

            <button
              onClick={saveMarks}
              className="bg-blue-500 text-white px-5 py-3 rounded"
            >
              Save Marks
            </button>

          </div>

          {/* MARKS TABLE */}

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

                  <th className="p-4 text-left">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {marksList.map((item)=>(

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {item.subject}
                    </td>

                    <td className="p-4">
                      {item.marks}
                    </td>

                    <td className="p-4 flex gap-3">

                      <button
                        onClick={()=>
                          updateMarks(item.id)
                        }
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={()=>
                          removeMarks(item.id)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
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

export default StudentMarks;
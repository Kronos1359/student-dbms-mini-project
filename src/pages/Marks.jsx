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

function Marks() {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");

  const [marksList, setMarksList] =
    useState([]);

  useEffect(() => {

    fetchStudents();
    fetchMarks();

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

  // FETCH MARKS

  const fetchMarks = async () => {

    const snapshot =
      await getDocs(collection(db, "marks"));

    let marksData = [];

    snapshot.forEach((docItem) => {

      marksData.push({
        id: docItem.id,
        ...docItem.data()
      });
    });

    setMarksList(marksData);
  };

  // SAVE MARKS

  const saveMarks = async () => {

    if (!selectedStudent) {
      alert("Select Student");
      return;
    }

    await addDoc(collection(db, "marks"), {

      studentId: selectedStudent.studentId,
      studentName: selectedStudent.name,
      subject,
      marks: Number(marks)

    });

    alert("Marks Saved");

    setSubject("");
    setMarks("");

    fetchMarks();
  };

  // UPDATE MARKS

  const updateMarks = async (id) => {

    const docRef =
      doc(db, "marks", id);

    const newMarks =
      prompt("Enter New Marks");

    if(newMarks === null) return;

    await updateDoc(docRef, {

      marks: Number(newMarks)

    });

    fetchMarks();
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

    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-4xl font-bold mb-5">
        Marks Management
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
            className={`p-5 rounded-2xl shadow cursor-pointer transition
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

            <p>Semester: {student.semester}</p>

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
            className="bg-black text-white px-5 py-3 rounded"
          >
            Save Marks
          </button>

        </div>
      )}

      {/* ALL MARKS */}

      <h2 className="text-3xl font-bold mb-5">
        Marks Records
      </h2>

      <div className="grid grid-cols-3 gap-5">

        {marksList.map((item)=>(

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
              {item.marks}
            </p>

            <button
              onClick={()=>updateMarks(item.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
            >
              Edit Marks
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Marks;
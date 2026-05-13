import { useState } from "react";

import { Link } from "react-router-dom";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

function Register() {

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  const register = async () => {

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {

        uid: user.uid,
        name,
        email,
        phone,
        studentId,
        department,
        semester,
        year,
        section,
        role

      });

      alert("Registration Successful");

    } catch (error) {
      alert(error.message);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Phone"
          onChange={(e)=>setPhone(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Student ID"
          onChange={(e)=>setStudentId(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Department"
          onChange={(e)=>setDepartment(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Semester"
          onChange={(e)=>setSemester(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Year"
          onChange={(e)=>setYear(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Section"
          onChange={(e)=>setSection(e.target.value)}
        />

        <select
          className="w-full border p-3 rounded mb-3"
          onChange={(e)=>setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <input
          type="password"
          className="w-full border p-3 rounded mb-3"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="w-full bg-black text-white p-3 rounded"
        >
          Register
        </button>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
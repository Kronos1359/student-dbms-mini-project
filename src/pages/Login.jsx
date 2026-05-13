import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const uid = userCredential.user.uid;

      const userRef = doc(db, "users", uid);

      const userSnap = await getDoc(userRef);

      const userData = userSnap.data();

      if(userData.role === "teacher"){
        navigate("/teacher");
      }
      else if(userData.role === "student"){
        navigate("/student");
      }

      console.log(userData);

    } catch (error) {
      alert(error.message);
    }

    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (

    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 rounded mb-3"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-black text-white p-3 rounded"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
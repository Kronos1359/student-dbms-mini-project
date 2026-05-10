import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function TeacherSidebar() {

  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="w-[250px] bg-blue-900 text-white min-h-screen p-5">

      <h1 className="text-3xl font-bold mb-10">
        Teacher Panel
      </h1>

      <div className="flex flex-col gap-3">

        <Link to="/teacher" className="bg-blue-700 hover:bg-blue-600 px-4 py-3 rounded-xl transition">
          Dashboard
        </Link>

        <Link to="/students" className="bg-blue-700 hover:bg-blue-600 px-4 py-3 rounded-xl transition">
          Students
        </Link>

        <Link to="/marks-list" className="bg-blue-700 hover:bg-blue-600 px-4 py-3 rounded-xl transitionver:bg-blue-700 p-2 rounded">
          Marks
        </Link>

        <Link to="/attendance-list" className="bg-blue-700 hover:bg-blue-600 px-4 py-3 rounded-xl transition">
          Attendance
        </Link>

      </div>

      <button
        onClick={logout}
        className="mt-10 w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl transition"
      >
        Logout
      </button>

    </div>
  );
}

export default TeacherSidebar;
import {
  Link
} from "react-router-dom";

import {
  signOut
} from "firebase/auth";

import {
  auth
} from "../firebase/firebase";

function StudentSidebar() {

  const logout = async () => {

    await signOut(auth);

    window.location.href = "/";
  };

  return (

    <div className="w-[250px] bg-blue-900 text-white p-5 min-h-screen">

      <h1 className="text-3xl font-bold mb-10">
        Student Panel
      </h1>

      {/* NAVIGATION */}

      <div className="flex flex-col gap-4">

        <Link
          to="/student"
          className="bg-blue-700 hover:bg-blue-600 px-4 py-3 rounded-xl transition"
        >
          Dashboard
        </Link>

        <Link
          to="/student-marks-view"
          className="bg-blue-700 hover:bg-blue-600 px-4 py-3 rounded-xl transition"
        >
          Marks
        </Link>

        <Link
          to="/student-attendance-view"
          className="bg-blue-700 hover:bg-blue-600 px-4 py-3 rounded-xl transition"
        >
          Attendance
        </Link>

        {/*<Link
          to="/notifications"
          className="bg-blue-700 hover:bg-blue-600 px-4 py-3 rounded-xl transition"
        >
          Notifications
        </Link>*/}

      </div>

      {/* LOGOUT */}

      <button
        onClick={logout}
        className="mt-10 w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl transition"
      >
        Logout
      </button>

    </div>
  );
}

export default StudentSidebar;
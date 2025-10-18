import Navbar from "../Components/Navbar/Navbar";
import NavigationTab from "../Components/NavigationTab";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getClassByCode } from "../features/class/classSlice.js";
import { useParams } from "react-router-dom";
import { FiUser, FiUsers, FiCalendar, FiActivity } from "react-icons/fi";
import { Link } from "react-router-dom";

const Class = () => {
  const { colors } = useSelector((state) => state.color);
  const [extended, setExtended] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const dispatch = useDispatch();

  const { classCode } = useParams();

  const { classDetails, classDetailsLoading, classDetailsError } = useSelector(
    (state) => state.class
  );
  const { role: rawRole, user } = useSelector((state) => state.user);
  const role = rawRole || user?.role;
  const isTeacher = role === "teacher" || role === "admin";

  useEffect(() => {
    setActiveTab("none");
    if (classCode) dispatch(getClassByCode(classCode));
  }, [classCode, dispatch]);

  const students = useMemo(() => classDetails?.students || [], [classDetails]);
  const teacher = classDetails?.teacher;
  const totalStudents = students.length;

  // Placeholder dynamic attendance stats (future: compute real-time) - only relevant for teacher
  const present = isTeacher ? Math.round(totalStudents * 0.75) : 0;
  const absent = isTeacher ? totalStudents - present : 0;
  const percentage =
    isTeacher && totalStudents
      ? Math.round((present / totalStudents) * 100)
      : 0;

  const skeletonBlock = (
    <div className="animate-pulse flex flex-col gap-6 w-full">
      <div
        className="h-40 rounded-2xl"
        style={{ backgroundColor: colors.Secondary }}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl"
            style={{ backgroundColor: colors.Secondary }}
          />
        ))}
      </div>
      <div
        className="h-96 rounded-2xl"
        style={{ backgroundColor: colors.Secondary }}
      />
    </div>
  );

  const errorBlock = (
    <div
      className="p-6 rounded-2xl border text-center"
      style={{
        backgroundColor: colors.Background,
        borderColor: colors.Error,
        color: colors.Error,
      }}
    >
      Failed to load class details.
      <div className="mt-4">
        <button
          onClick={() => dispatch(getClassByCode(classCode))}
          className="px-4 py-2 rounded-md font-semibold"
          style={{ backgroundColor: colors.Primary, color: "white" }}
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar isMenuExtended={extended} setIsMenuExtended={setExtended} />
      <div
        className="w-full min-h-screen flex"
        style={{ backgroundColor: colors.Secondary }}
      >
        {/* Side Navigation */}
        <NavigationTab
          isMenuExtended={extended}
          setIsMenuExtended={setExtended}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col gap-8 rounded-xl">
          {/* Header / Hero */}
          <section
            className="relative rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.Primary} 0%, ${colors.Background} 85%)`,
              color: colors.Text.Primary,
            }}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                  {classDetails?.className || "Loading Class"}
                </h1>
                <p className="text-sm md:text-base opacity-80 font-medium flex items-center gap-2">
                  <FiCalendar /> Created{" "}
                  {new Date(
                    classDetails?.createdAt || Date.now()
                  ).toLocaleDateString()}
                </p>
                <p className="text-xs md:text-sm mt-1 opacity-70">
                  Class Code:{" "}
                  <span className="font-semibold">
                    {classDetails?.classCode || classCode}
                  </span>
                </p>
              </div>
              <div className="flex gap-4">
                <div
                  className="rounded-xl px-4 py-3 backdrop-blur-md shadow border text-sm flex flex-col"
                  style={{
                    backgroundColor: colors.Background + "CC",
                    borderColor: colors.Secondary,
                  }}
                >
                  <span className="font-semibold text-xs opacity-70">
                    Teacher
                  </span>
                  <span className="font-bold flex items-center gap-2">
                    <FiUser /> {teacher?.name || "—"}
                  </span>
                </div>
                {isTeacher && (
                  <Link to="./session">
                  <button
                    className="rounded-xl px-6 py-3 font-semibold text-sm shadow hover:scale-105 active:scale-95 transition"
                    style={{
                      backgroundColor: colors.Primary,
                      color: colors.Text.Primary,
                    }}
                  >
                    Start Session
                  </button>
                  </Link>
                )}
              </div>
            </div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]" />
          </section>

          {isTeacher && (
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Students",
                  value: totalStudents,
                  icon: <FiUsers />,
                },
                {
                  label: "Present",
                  value: present,
                  icon: <FiActivity />,
                },
                {
                  label: "Absent",
                  value: absent,
                  icon: <FiActivity />,
                },
                {
                  label: "Attendance %",
                  value: percentage + "%",
                  icon: <FiActivity />,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 flex items-center gap-4 shadow border"
                  style={{
                    backgroundColor: colors.Background,
                    borderColor: colors.Secondary,
                    color: colors.Text.Primary,
                  }}
                >
                  <div className="text-xl opacity-70">{s.icon}</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium opacity-70 tracking-wide">
                      {s.label}
                    </span>
                    <span className="text-2xl font-bold leading-none">
                      {s.value}
                    </span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Conditional States */}
          {classDetailsLoading && skeletonBlock}
          {classDetailsError && !classDetailsLoading && errorBlock}

          {!classDetailsLoading && !classDetailsError && isTeacher && (
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Students Table */}
              <div
                className="rounded-2xl shadow border col-span-2 flex flex-col"
                style={{
                  backgroundColor: colors.Background,
                  borderColor: colors.Secondary,
                  color: colors.Text.Primary,
                }}
              >
                <div
                  className="flex items-center justify-between p-4 border-b"
                  style={{ borderColor: colors.Secondary }}
                >
                  <h2 className="text-xl font-bold">Students</h2>
                  <input
                    type="date"
                    className="px-3 py-1 rounded-md text-sm"
                    style={{
                      backgroundColor: colors.Secondary,
                      color: colors.Text.Primary,
                      border: `1px solid ${colors.Secondary}`,
                    }}
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: colors.Secondary,
                          color: colors.Text.Primary,
                        }}
                        className="text-left"
                      >
                        <th className="p-3 font-semibold">Name</th>
                        <th className="p-3 font-semibold">Roll No</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="p-6 text-center opacity-70"
                          >
                            No students yet.
                          </td>
                        </tr>
                      )}
                      {students.map((s) => (
                        <tr
                          key={s._id}
                          className="border-b last:border-b-0 hover:brightness-105"
                          style={{ borderColor: colors.Secondary }}
                        >
                          <td className="p-3 font-medium">{s.name}</td>
                          <td className="p-3">
                            <span className="break-all text-xs md:text-sm opacity-80">
                              {s.email}
                            </span>
                          </td>
                          <td className="p-3 text-xs md:text-sm opacity-80">
                            {s.department || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Side Panel (Teacher) */}
              <div className="flex flex-col gap-6">
                <div
                  className="rounded-2xl shadow border p-5"
                  style={{
                    backgroundColor: colors.Background,
                    borderColor: colors.Secondary,
                    color: colors.Text.Primary,
                  }}
                >
                  <h3 className="text-lg font-bold mb-3">Teacher</h3>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shadow"
                      style={{ backgroundColor: colors.Secondary }}
                    >
                      {(teacher?.name || "?").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {teacher?.name || "—"}
                      </span>
                      <span className="text-xs opacity-70">
                        {teacher?.email || ""}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs opacity-70 space-y-1">
                    <p>Department: {teacher?.department || "—"}</p>
                    <p>Role: {teacher?.role || "teacher"}</p>
                  </div>
                </div>

                <div
                  className="rounded-2xl shadow border p-5 flex flex-col gap-4"
                  style={{
                    backgroundColor: colors.Background,
                    borderColor: colors.Secondary,
                    color: colors.Text.Primary,
                  }}
                >
                  <h3 className="text-lg font-bold">Quick Actions</h3>
                  <button
                    className="w-full rounded-md px-4 py-2 font-semibold text-sm hover:scale-105 active:scale-95 transition"
                    style={{
                      backgroundColor: colors.Primary,
                      color: colors.Text.Primary,
                    }}
                  >
                    Start Session
                  </button>
                  <button
                    className="w-full rounded-md px-4 py-2 font-semibold text-sm hover:scale-105 active:scale-95 transition"
                    style={{ backgroundColor: colors.Secondary }}
                  >
                    Export Attendance
                  </button>
                </div>
              </div>
            </section>
          )}

          {!classDetailsLoading && !classDetailsError && !isTeacher && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student View: Class & Teacher Summary */}
              <div
                className="rounded-2xl shadow border p-6 flex flex-col gap-4 lg:col-span-2"
                style={{
                  backgroundColor: colors.Background,
                  borderColor: colors.Secondary,
                  color: colors.Text.Primary,
                }}
              >
                <h2 className="text-xl font-bold">Class Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="opacity-70 text-xs">Class Name</span>
                    <span className="font-semibold">
                      {classDetails?.className}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="opacity-70 text-xs">Class Code</span>
                    <span className="font-semibold">
                      {classDetails?.classCode}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="opacity-70 text-xs">Teacher</span>
                    <span className="font-semibold">{teacher?.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="opacity-70 text-xs">Total Students</span>
                    <span className="font-semibold">{totalStudents}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="opacity-70 text-xs">Created</span>
                    <span className="font-semibold">
                      {new Date(
                        classDetails?.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="opacity-70 text-xs">Updated</span>
                    <span className="font-semibold">
                      {new Date(
                        classDetails?.updatedAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl shadow border p-6 flex flex-col gap-4"
                style={{
                  backgroundColor: colors.Background,
                  borderColor: colors.Secondary,
                  color: colors.Text.Primary,
                }}
              >
                <h3 className="text-lg font-bold">Teacher</h3>
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shadow"
                    style={{ backgroundColor: colors.Secondary }}
                  >
                    {(teacher?.name || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {teacher?.name || "—"}
                    </span>
                    <span className="text-xs opacity-70">
                      {teacher?.email || ""}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs opacity-70 space-y-1">
                  <p>Department: {teacher?.department || "—"}</p>
                  <p>Role: {teacher?.role || "teacher"}</p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default Class;

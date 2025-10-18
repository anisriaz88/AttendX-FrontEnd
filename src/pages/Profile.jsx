import Navbar from "../Components/Navbar/Navbar";
import NavigationTab from "../Components/NavigationTab";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiEdit2, FiSave, FiX, FiUpload, FiUser } from "react-icons/fi";
import { updateUserProfile } from "../features/user/userSlice.js";

const Profile = () => {
  const { colors } = useSelector((state) => state.color);
  const { user, updatingProfile, updateProfileError, updateProfileSuccess } =
    useSelector((state) => state.user);
  const role = user?.role;
  const isStudent = role === "student";
  const canEditDepartment = role === "teacher";
  const dispatch = useDispatch();

  const [extended, setExtended] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const fileInputRef = useRef(null);

  // Local editable state
  const [form, setForm] = useState({
    name: user?.name || "",
    department: user?.department || "",
    section: user?.section || "",
    semester: user?.semester || "",
    session: user?.session || "",
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    user?.profilePicture || ""
  );
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedBanner, setShowSavedBanner] = useState(false);

  useEffect(() => {
    if (updateProfileSuccess) {
      setShowSavedBanner(true);
      const t = setTimeout(() => setShowSavedBanner(false), 2500);
      return () => clearTimeout(t);
    }
  }, [updateProfileSuccess]);

  const onEdit = () => setIsEditing(true);
  const onCancel = () => {
    setIsEditing(false);
    setForm({
      name: user?.name || "",
      department: user?.department || "",
      section: user?.section || "",
      semester: user?.semester || "",
      session: user?.session || "",
    });
    setProfilePicturePreview(user?.profilePicture || "");
    setProfilePictureFile(null);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onPickImage = () => fileInputRef.current?.click();
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePicturePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSave = () => {
    const payload = { name: form.name };
    if (canEditDepartment && form.department)
      payload.department = form.department;
    if (isStudent) {
      payload.section = form.section;
      payload.semester = form.semester;
      payload.session = form.session;
    }
    if (profilePictureFile) payload.profilePicture = profilePictureFile;
    dispatch(updateUserProfile(payload)).then((res) => {
      if (!res.error) setIsEditing(false);
    });
  };

  const labelStyle = "text-xs uppercase tracking-wide font-semibold opacity-70";
  const valueBoxBase =
    "w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition";
  const editableBox = {
    backgroundColor: colors.Secondary,
    border: `1px solid ${colors.Secondary}`,
    color: colors.Text.Primary,
  };
  const readOnlyBox = {
    backgroundColor: colors.Background,
    border: `1px solid ${colors.Secondary}`,
    color: colors.Text.Primary,
  };

  return (
    <>
      <Navbar isMenuExtended={extended} setIsMenuExtended={setExtended} />
      <div
        className="w-full min-h-screen flex"
        style={{ backgroundColor: colors.Secondary }}
      >
        <NavigationTab
          isMenuExtended={extended}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsMenuExtended={setExtended}
        />
        <main className="flex-1 p-4 md:p-10 overflow-y-auto flex flex-col gap-8">
          {/* Hero Header */}
          <section
            className="relative rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.Primary} 0%, ${colors.Background} 85%)`,
              color: colors.Text.Primary,
            }}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <div
                    className="h-28 w-28 md:h-32 md:w-32 rounded-2xl flex items-center justify-center font-bold text-4xl shadow border overflow-hidden"
                    style={{
                      backgroundColor: colors.Background,
                      borderColor: colors.Secondary,
                      color: colors.Text.Primary,
                    }}
                  >
                    {profilePicturePreview ? (
                      <img
                        src={profilePicturePreview}
                        alt="profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <FiUser className="opacity-60" />
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={onPickImage}
                      className="absolute -bottom-2 -right-2 bg-black/60 text-white px-2 py-1 rounded-md text-[10px] flex items-center gap-1"
                    >
                      <FiUpload /> Change
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                    {user?.name || "User"}
                  </h1>
                  <p className="text-sm opacity-80 font-medium">
                    {user?.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 h-fit">
                {!isEditing && (
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg shadow hover:scale-105 active:scale-95 transition"
                    style={{
                      backgroundColor: colors.Background,
                      color: colors.Text.Primary,
                    }}
                  >
                    <FiEdit2 /> Edit Profile
                  </button>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={onSave}
                      disabled={updatingProfile}
                      className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg shadow hover:scale-105 active:scale-95 transition disabled:opacity-60"
                      style={{
                        backgroundColor: colors.Primary,
                        color: colors.Text.Primary,
                      }}
                    >
                      <FiSave /> {updatingProfile ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={onCancel}
                      className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg shadow hover:scale-105 active:scale-95 transition"
                      style={{
                        backgroundColor: colors.Background,
                        color: colors.Text.Primary,
                      }}
                    >
                      <FiX /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]" />
          </section>

          {/* Status Banners */}
          {updateProfileError && (
            <div
              className="px-4 py-3 text-sm rounded-md font-medium shadow"
              style={{
                backgroundColor: colors.Error + "1A",
                color: colors.Error,
              }}
            >
              {updateProfileError}
            </div>
          )}
          {showSavedBanner && (
            <div
              className="px-4 py-3 text-sm rounded-md font-medium shadow"
              style={{
                backgroundColor: colors.Primary + "1A",
                color: colors.Primary,
              }}
            >
              Profile updated successfully
            </div>
          )}

          {/* Editable Form */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 flex flex-col gap-8">
              <div
                className="rounded-2xl shadow border p-6 flex flex-col gap-6"
                style={{
                  backgroundColor: colors.Background,
                  borderColor: colors.Secondary,
                  color: colors.Text.Primary,
                }}
              >
                <h2 className="text-xl font-bold">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label className={labelStyle}>Name</label>
                    {isEditing ? (
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        className={valueBoxBase}
                        style={editableBox}
                        placeholder="Enter name"
                      />
                    ) : (
                      <div className={valueBoxBase} style={readOnlyBox}>
                        {user?.name || "—"}
                      </div>
                    )}
                  </div>

                  {/* Email (immutable) */}
                  <div className="flex flex-col gap-1">
                    <label className={labelStyle}>Email</label>
                    <div className={valueBoxBase} style={readOnlyBox}>
                      {user?.email || "—"}
                    </div>
                  </div>

                  {/* Department: editable only by teacher, read-only for others */}
                  <div className="flex flex-col gap-1">
                    <label className={labelStyle}>Department</label>
                    {isEditing && canEditDepartment ? (
                      <input
                        name="department"
                        value={form.department}
                        onChange={onChange}
                        className={valueBoxBase}
                        style={editableBox}
                        placeholder="e.g. Computer Science"
                      />
                    ) : (
                      <div className={valueBoxBase} style={readOnlyBox}>
                        {user?.department || "—"}
                      </div>
                    )}
                  </div>

                  {/* Registration Number (immutable) */}
                  {isStudent && (
                    <div className="flex flex-col gap-1">
                      <label className={labelStyle}>Registration Number</label>
                      <div className={valueBoxBase} style={readOnlyBox}>
                        {user?.registrationNumber || "—"}
                      </div>
                    </div>
                  )}

                  {/* Section (student only) */}
                  {isStudent && (
                    <div className="flex flex-col gap-1">
                      <label className={labelStyle}>Section</label>
                      {isEditing ? (
                        <input
                          name="section"
                          value={form.section}
                          onChange={onChange}
                          className={valueBoxBase}
                          style={editableBox}
                          placeholder="e.g. A"
                        />
                      ) : (
                        <div className={valueBoxBase} style={readOnlyBox}>
                          {user?.section || "—"}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Semester (student only) */}
                  {isStudent && (
                    <div className="flex flex-col gap-1">
                      <label className={labelStyle}>Semester</label>
                      {isEditing ? (
                        <input
                          name="semester"
                          value={form.semester}
                          onChange={onChange}
                          className={valueBoxBase}
                          style={editableBox}
                          placeholder="e.g. 5"
                        />
                      ) : (
                        <div className={valueBoxBase} style={readOnlyBox}>
                          {user?.semester || "—"}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Session (student only) */}
                  {isStudent && (
                    <div className="flex flex-col gap-1">
                      <label className={labelStyle}>Session</label>
                      {isEditing ? (
                        <input
                          name="session"
                          value={form.session}
                          onChange={onChange}
                          className={valueBoxBase}
                          style={editableBox}
                          placeholder="e.g. 2023-2027"
                        />
                      ) : (
                        <div className={valueBoxBase} style={readOnlyBox}>
                          {user?.session || "—"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="flex flex-col gap-8">
              <div
                className="rounded-2xl shadow border p-6 flex flex-col gap-4"
                style={{
                  backgroundColor: colors.Background,
                  borderColor: colors.Secondary,
                  color: colors.Text.Primary,
                }}
              >
                <h3 className="text-lg font-bold">Account Summary</h3>
                <ul className="text-xs opacity-80 space-y-1">
                  <li>
                    <span className="font-semibold">Role:</span>{" "}
                    {user?.role || "—"}
                  </li>
                  <li>
                    <span className="font-semibold">Email:</span>{" "}
                    {user?.email || "—"}
                  </li>
                  <li>
                    <span className="font-semibold">Department:</span>{" "}
                    {user?.department || "—"}
                  </li>
                  {isStudent && (
                    <li>
                      <span className="font-semibold">Reg #:</span>{" "}
                      {user?.registrationNumber || "—"}
                    </li>
                  )}
                  {isStudent && (
                    <li>
                      <span className="font-semibold">Semester:</span>{" "}
                      {user?.semester || "—"}
                    </li>
                  )}
                  {isStudent && (
                    <li>
                      <span className="font-semibold">Session:</span>{" "}
                      {user?.session || "—"}
                    </li>
                  )}
                  {isStudent && (
                    <li>
                      <span className="font-semibold">Section:</span>{" "}
                      {user?.section || "—"}
                    </li>
                  )}
                  <li>
                    <span className="font-semibold">Last Updated:</span>{" "}
                    {user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "—"}
                  </li>
                </ul>
              </div>
              <div
                className="rounded-2xl shadow border p-6 flex flex-col gap-3"
                style={{
                  backgroundColor: colors.Background,
                  borderColor: colors.Secondary,
                  color: colors.Text.Primary,
                }}
              >
                <h3 className="text-lg font-bold">Help</h3>
                <p className="text-xs opacity-70 leading-relaxed">
                  {isStudent ? (
                    <>
                      Department is locked for students along with registration
                      and academic identifiers. Contact admin for changes.
                    </>
                  ) : canEditDepartment ? (
                    <>
                      You can update the department, name and profile picture.
                      Other organizational attributes require administrator
                      support.
                    </>
                  ) : (
                    <>
                      Only name and profile picture can be updated for {role}.
                      Contact an administrator for other changes.
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Profile;

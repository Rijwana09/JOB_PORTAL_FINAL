import {
  useEffect,
  useState,
} from "react";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBookOpen,
  FiEdit3,
  FiSave,
  FiX,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getMyProfile,
  updateMyProfile,
} from "../../api/userApi";


const StudentProfile = () => {

  /*
  |--------------------------------------------------------------------------
  | Profile State
  |--------------------------------------------------------------------------
  */

  const [
    profile,
    setProfile,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Saving State
  |--------------------------------------------------------------------------
  */

  const [
    saving,
    setSaving,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Edit Mode
  |--------------------------------------------------------------------------
  */

  const [
    editing,
    setEditing,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    education: "",
    skills: "",
  });


  /*
  |--------------------------------------------------------------------------
  | Fetch Profile
  |--------------------------------------------------------------------------
  */

  const fetchProfile =
    async () => {

      try {

        setLoading(true);

        const response =
          await getMyProfile();

        const user =
          response?.data || null;

        if (!user) {
          throw new Error(
            "Profile data not found"
          );
        }

        setProfile(user);

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          location:
            user.location || "",
          bio: user.bio || "",
          education:
            user.education || "",
          skills:
            Array.isArray(user.skills)
              ? user.skills.join(", ")
              : "",
        });

      } catch (error) {

        console.error(
          "Failed to fetch profile:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile"
        );

      } finally {

        setLoading(false);

      }
    };


  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchProfile();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Input Handler
  |--------------------------------------------------------------------------
  */

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;

      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };


  /*
  |--------------------------------------------------------------------------
  | Start Editing
  |--------------------------------------------------------------------------
  */

  const handleEdit =
    () => {

      setEditing(true);

    };


  /*
  |--------------------------------------------------------------------------
  | Cancel Editing
  |--------------------------------------------------------------------------
  */

  const handleCancel =
    () => {

      if (!profile) {
        return;
      }

      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        location:
          profile.location || "",
        bio: profile.bio || "",
        education:
          profile.education || "",
        skills:
          Array.isArray(profile.skills)
            ? profile.skills.join(", ")
            : "",
      });

      setEditing(false);

    };


  /*
  |--------------------------------------------------------------------------
  | Submit Profile
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      if (!formData.name.trim()) {
        toast.error(
          "Name is required"
        );
        return;
      }

      try {

        setSaving(true);

        const skills =
          formData.skills
            .split(",")
            .map((skill) =>
              skill.trim()
            )
            .filter(Boolean);

        const response =
          await updateMyProfile({
            name:
              formData.name.trim(),

            phone:
              formData.phone.trim(),

            location:
              formData.location.trim(),

            bio:
              formData.bio.trim(),

            education:
              formData.education.trim(),

            skills,
          });

        const updatedUser =
          response?.data;

        if (updatedUser) {

          setProfile(
            updatedUser
          );

          setFormData({
            name:
              updatedUser.name || "",

            phone:
              updatedUser.phone || "",

            location:
              updatedUser.location || "",

            bio:
              updatedUser.bio || "",

            education:
              updatedUser.education || "",

            skills:
              Array.isArray(
                updatedUser.skills
              )
                ? updatedUser.skills.join(
                    ", "
                  )
                : "",
          });

        }

        setEditing(false);

        toast.success(
          "Profile updated successfully"
        );

      } catch (error) {

        console.error(
          "Failed to update profile:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to update profile"
        );

      } finally {

        setSaving(false);

      }
    };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">

        <div className="mx-auto max-w-5xl">

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="flex items-center gap-3 text-gray-500">

              <FiRefreshCw className="animate-spin text-lg" />

              <span>
                Loading profile...
              </span>

            </div>

          </div>

        </div>

      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Error / Profile Missing
  |--------------------------------------------------------------------------
  */

  if (!profile) {

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">

        <div className="mx-auto max-w-5xl">

          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

            <FiAlertCircle className="mx-auto text-4xl text-red-500" />

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Unable to load profile
            </h2>

            <p className="mt-2 text-gray-500">
              Something went wrong while
              loading your profile.
            </p>

            <button
              type="button"
              onClick={fetchProfile}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              <FiRefreshCw />

              Retry
            </button>

          </div>

        </div>

      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Avatar Initial
  |--------------------------------------------------------------------------
  */

  const profileInitial =
    profile.name
      ?.charAt(0)
      ?.toUpperCase() || "U";


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* ------------------------------------------------
            Page Header
        ------------------------------------------------ */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Manage your personal and professional information.
            </p>

          </div>


          {!editing && (

            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >

              <FiEdit3 />

              Edit Profile

            </button>

          )}

        </div>


        {/* ------------------------------------------------
            Profile Header Card
        ------------------------------------------------ */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600 sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">

            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-4">

                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-100 text-3xl font-bold text-blue-600 shadow-md sm:h-28 sm:w-28">

                  {profile.avatar ? (

                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    profileInitial

                  )}

                </div>


                <div className="pb-1">

                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {profile.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Student
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ------------------------------------------------
            Profile Form / Information
        ------------------------------------------------ */}

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          <div className="grid gap-6 lg:grid-cols-3">

            {/* ------------------------------------------------
                Personal Information
            ------------------------------------------------ */}

            <div className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6">

                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Keep your profile information up to date.
                </p>

              </div>


              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">

                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-600"
                    />

                  </div>

                </div>


                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="email"
                      type="email"
                      value={profile.email || ""}
                      disabled
                      className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 py-2.5 pl-10 pr-3 text-sm text-gray-500"
                    />

                  </div>

                  <p className="mt-1.5 text-xs text-gray-400">
                    Email cannot be changed here.
                  </p>

                </div>


                {/* Phone */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>

                  <div className="relative">

                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="Enter phone number"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-600"
                    />

                  </div>

                </div>


                {/* Location */}

                <div>

                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>

                  <div className="relative">

                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g. Siliguri, West Bengal"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-600"
                    />

                  </div>

                </div>


                {/* Education */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="education"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Education
                  </label>

                  <div className="relative">

                    <FiBookOpen className="absolute left-3 top-3 text-gray-400" />

                    <input
                      id="education"
                      name="education"
                      type="text"
                      value={formData.education}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g. B.Tech Computer Science Engineering"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-600"
                    />

                  </div>

                </div>


                {/* Bio */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="bio"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    About Me
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    rows="5"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!editing}
                    maxLength={500}
                    placeholder="Tell recruiters a little about yourself..."
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  />

                  {editing && (

                    <p className="mt-1 text-right text-xs text-gray-400">
                      {formData.bio.length}/500
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* ------------------------------------------------
                Skills
            ------------------------------------------------ */}

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">

                <h2 className="text-lg font-semibold text-gray-900">
                  Skills
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add skills that represent your strengths.
                </p>

              </div>


              {editing ? (

                <div>

                  <label
                    htmlFor="skills"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Skills
                  </label>

                  <textarea
                    id="skills"
                    name="skills"
                    rows="6"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, JavaScript, Node.js, MongoDB"
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Separate skills using commas.
                  </p>

                </div>

              ) : (

                <div className="flex flex-wrap gap-2">

                  {profile.skills?.length > 0 ? (

                    profile.skills.map(
                      (skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p className="text-sm text-gray-400">
                      No skills added yet.
                    </p>

                  )}

                </div>

              )}

            </div>

          </div>


          {/* ------------------------------------------------
              Edit Actions
          ------------------------------------------------ */}

          {editing && (

            <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <FiX />

                Cancel

              </button>


              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ? (

                  <>
                    <FiRefreshCw className="animate-spin" />

                    Saving...
                  </>

                ) : (

                  <>
                    <FiSave />

                    Save Changes
                  </>

                )}

              </button>

            </div>

          )}

        </form>


        {/* ------------------------------------------------
            Account Information
        ------------------------------------------------ */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-start gap-3">

            <FiCheckCircle className="mt-0.5 shrink-0 text-green-500" />

            <div>

              <h2 className="font-semibold text-gray-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your account was created on{" "}
                {profile.createdAt
                  ? new Date(
                      profile.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
                .
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default StudentProfile;
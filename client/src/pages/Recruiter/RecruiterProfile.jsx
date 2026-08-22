import {
  useEffect,
  useState,
} from "react";

import {
  FiBriefcase,
  FiEdit3,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getMyProfile,
  updateMyProfile,
} from "../../api/userApi";


const RecruiterProfile = () => {

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [formData, setFormData] =
  useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    education: "",
    skills: [],
    avatar: "",

    companyName: "",
    designation: "",
    companyWebsite: "",
    companyDescription: "",
    companyLinkedIn: "",
  });


  const [skillInput, setSkillInput] =
    useState("");


  /*
  |--------------------------------------------------------------------------
  | Fetch Recruiter Profile
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

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
            location: user.location || "",
            bio: user.bio || "",
            education: user.education || "",
            skills:
                Array.isArray(user.skills)
                ? user.skills
                : [],
            avatar: user.avatar || "",

            companyName:
                user.companyName || "",
            designation:
                user.designation || "",
            companyWebsite:
                user.companyWebsite || "",
            companyDescription:
                user.companyDescription || "",
            companyLinkedIn:
                user.companyLinkedIn || "",
            });

        } catch (error) {

          console.error(
            "Failed to fetch recruiter profile:",
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


    fetchProfile();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Handle Input
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  /*
  |--------------------------------------------------------------------------
  | Add Skill
  |--------------------------------------------------------------------------
  */

  const handleAddSkill = () => {

    const skill =
      skillInput.trim();

    if (!skill) {
      return;
    }

    if (
      formData.skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      )
    ) {

      toast.error(
        "Skill already added"
      );

      return;
    }

    if (formData.skills.length >= 30) {

      toast.error(
        "You can add up to 30 skills"
      );

      return;
    }

    setFormData((previous) => ({
      ...previous,
      skills: [
        ...previous.skills,
        skill,
      ],
    }));

    setSkillInput("");

  };


  /*
  |--------------------------------------------------------------------------
  | Remove Skill
  |--------------------------------------------------------------------------
  */

  const handleRemoveSkill = (skillToRemove) => {

    setFormData((previous) => ({
      ...previous,
      skills:
        previous.skills.filter(
          (skill) =>
            skill !== skillToRemove
        ),
    }));

  };


  /*
  |--------------------------------------------------------------------------
  | Handle Skill Enter
  |--------------------------------------------------------------------------
  */

  const handleSkillKeyDown = (event) => {

    if (event.key === "Enter") {

      event.preventDefault();

      handleAddSkill();

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Start Editing
  |--------------------------------------------------------------------------
  */

  const handleEdit = () => {

    setEditing(true);

  };


  /*
  |--------------------------------------------------------------------------
  | Cancel Editing
  |--------------------------------------------------------------------------
  */

  const handleCancel = () => {

    if (!profile) {
      return;
    }

    setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        education: profile.education || "",
        skills:
            Array.isArray(profile.skills)
            ? profile.skills
            : [],
        avatar: profile.avatar || "",

        companyName:
            profile.companyName || "",
        designation:
            profile.designation || "",
        companyWebsite:
            profile.companyWebsite || "",
        companyDescription:
            profile.companyDescription || "",
        companyLinkedIn:
            profile.companyLinkedIn || "",
        });

    setSkillInput("");

    setEditing(false);

  };


  /*
  |--------------------------------------------------------------------------
  | Save Profile
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {

    if (!formData.name.trim()) {
        toast.error("Name is required");
        return;
    }

        if (formData.name.trim().length < 2) {
        toast.error("Name must be at least 2 characters");
        return;
        }

        if (formData.bio.length > 500) {
        toast.error("Bio cannot exceed 500 characters");
        return;
        }

        if (formData.skills.length > 30) {
        toast.error("You can add up to 30 skills");
        return;
        }

        if (formData.companyName.length > 100) {
        toast.error("Company name cannot exceed 100 characters");
        return;
        }

        if (formData.designation.length > 100) {
        toast.error("Designation cannot exceed 100 characters");
        return;
        }

        if (formData.companyDescription.length > 1000) {
        toast.error(
            "Company description cannot exceed 1000 characters"
        );
        return;
        }

    try {

      setSaving(true);

      const response =
        await updateMyProfile(
          formData
        );

      const updatedUser =
        response?.data || null;

      if (!updatedUser) {
        throw new Error(
          "Updated profile data not found"
        );
      }

      setProfile(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        phone: updatedUser.phone || "",
        location: updatedUser.location || "",
        bio: updatedUser.bio || "",
        education: updatedUser.education || "",
        skills:
            Array.isArray(updatedUser.skills)
            ? updatedUser.skills
            : [],
        avatar: updatedUser.avatar || "",

        companyName:
            updatedUser.companyName || "",
        designation:
            updatedUser.designation || "",
        companyWebsite:
            updatedUser.companyWebsite || "",
        companyDescription:
            updatedUser.companyDescription || "",
        companyLinkedIn:
            updatedUser.companyLinkedIn || "",
        });

      setEditing(false);

      toast.success(
        "Profile updated successfully"
      );

    } catch (error) {

      console.error(
        "Failed to update recruiter profile:",
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
      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4">

          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-gray-500">
              Loading your profile...
            </p>

          </div>

        </div>

      </div>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Error / Profile Not Found
  |--------------------------------------------------------------------------
  */

  if (!profile) {

    return (
      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4">

          <div className="rounded-xl bg-white p-8 text-center shadow-sm">

            <FiUser className="mx-auto text-4xl text-gray-400" />

            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Profile not found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              We couldn't load your recruiter profile.
            </p>

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

  const avatarInitial =
    profile.name
      ?.charAt(0)
      ?.toUpperCase() || "R";

        const profileFields = [
        profile.name,
        profile.phone,
        profile.location,
        profile.bio,
        profile.education,
        profile.skills?.length > 0,
        profile.companyName,
        profile.designation,
        profile.companyWebsite,
        profile.companyDescription,
        profile.companyLinkedIn,
        ];

        const completedFields =
        profileFields.filter(Boolean).length;

        const profileCompletion =
        Math.round(
            (completedFields / profileFields.length) * 100
        );


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ------------------------------------------------
            Page Header
        ------------------------------------------------ */}

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Recruiter Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your professional information and recruiter profile.
          </p>

        </div>


        {/* ------------------------------------------------
            Profile Header Card
        ------------------------------------------------ */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

          <div className="px-5 pb-6 sm:px-8">

            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">

                {/* Avatar */}

                {profile.avatar ? (

                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                  />

                ) : (

                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-700 shadow-md">

                    {avatarInitial}

                  </div>

                )}


                <div className="pb-1">

                  <h2 className="text-xl font-bold text-gray-900">
                    {profile.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">

                    <FiBriefcase />

                    <span>
                      Recruiter
                    </span>

                  </div>

                </div>

              </div>


              {/* Edit / Save */}

              {!editing ? (

                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >

                  <FiEdit3 />

                  Edit Profile

                </button>

              ) : (

                <div className="flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <FiX />

                    Cancel

                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <FiSave />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ------------------------------------------------
            Profile Completion
        ------------------------------------------------ */}

            <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                <h2 className="text-xl font-semibold text-gray-900">
                    Profile Completion
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Complete your profile to give candidates more information about you.
                </p>

                </div>

                <div className="text-2xl font-bold text-blue-600">
                {profileCompletion}%
                </div>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">

                <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                    width: `${profileCompletion}%`,
                }}
                />

            </div>

            <p className="mt-2 text-xs text-gray-400">
                {completedFields} of {profileFields.length} profile sections completed
            </p>

            </div>


        {/* ------------------------------------------------
            Profile Information
        ------------------------------------------------ */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-8">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your basic recruiter information.
            </p>

          </div>


          <div className="grid gap-6 md:grid-cols-2">

            {/* Name */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              {editing ? (

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={50}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your name"
                />

              ) : (

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">

                  <FiUser className="text-gray-400" />

                  {profile.name || "Not provided"}

                </div>

              )}

            </div>


            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">

                <FiMail className="text-gray-400" />

                <span className="break-all">
                  {profile.email}
                </span>

              </div>

              <p className="mt-1 text-xs text-gray-400">
                Email cannot be changed here.
              </p>

            </div>


            {/* Phone */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone
              </label>

              {editing ? (

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter phone number"
                />

              ) : (

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">

                  <FiPhone className="text-gray-400" />

                  {profile.phone ||
                    "Not provided"}

                </div>

              )}

            </div>


            {/* Location */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>

              {editing ? (

                <input
                  type="text"
                  name="location"
                  value={
                    formData.location
                  }
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="City, State"
                />

              ) : (

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">

                  <FiMapPin className="text-gray-400" />

                  {profile.location ||
                    "Not provided"}

                </div>

              )}

            </div>

          </div>

        </div>


        {/* ------------------------------------------------
            Professional Information
        ------------------------------------------------ */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-8">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-gray-900">
              Professional Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tell candidates more about your professional background.
            </p>

          </div>


          {/* Education */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Education
            </label>

            {editing ? (

              <input
                type="text"
                name="education"
                value={
                  formData.education
                }
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. MBA in Human Resources"
              />

            ) : (

              <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">

                {profile.education ||
                  "Not provided"}

              </div>

            )}

          </div>


          {/* Bio */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Professional Bio
            </label>

            {editing ? (

              <>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={500}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Tell candidates about yourself..."
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {formData.bio.length}/500
                </p>

              </>

            ) : (

              <div className="min-h-[100px] rounded-lg bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">

                {profile.bio ||
                  "No professional bio added yet."}

              </div>

            )}

          </div>


          {/* Skills */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Skills
            </label>


            {editing && (

              <div className="mb-4 flex flex-col gap-2 sm:flex-row">

                <input
                  type="text"
                  value={skillInput}
                  onChange={(event) =>
                    setSkillInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleSkillKeyDown
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Add a skill"
                />

                <button
                  type="button"
                  onClick={
                    handleAddSkill
                  }
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Add Skill
                </button>

              </div>

            )}


            <div className="flex flex-wrap gap-2">

              {(editing
                ? formData.skills
                : profile.skills || []
              ).length > 0 ? (

                (editing
                  ? formData.skills
                  : profile.skills
                ).map((skill) => (

                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                  >

                    {skill}

                    {editing && (

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveSkill(
                            skill
                          )
                        }
                        className="rounded-full text-blue-500 hover:text-red-500"
                      >

                        <FiX />

                      </button>

                    )}

                  </span>

                ))

              ) : (

                <p className="text-sm text-gray-400">
                  No skills added yet.
                </p>

              )}

            </div>

          </div>

        </div>

        {/* ------------------------------------------------
    Company Information
------------------------------------------------ */}

<div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-8">

  <div className="mb-6">

    <h2 className="text-xl font-semibold text-gray-900">
      Company Information
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Information about the company you represent.
    </p>

  </div>

  <div className="grid gap-6 md:grid-cols-2">

    {/* Company Name */}

    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        Company Name
      </label>

      {editing ? (

        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          maxLength={100}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Enter company name"
        />

      ) : (

        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">
          {profile.companyName ||
            "Not provided"}
        </div>

      )}

    </div>


    {/* Designation */}

    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        Designation
      </label>

      {editing ? (

        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          maxLength={100}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. HR Manager"
        />

      ) : (

        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">
          {profile.designation ||
            "Not provided"}
        </div>

      )}

    </div>


    {/* Company Website */}

    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        Company Website
      </label>

      {editing ? (

        <input
          type="url"
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="https://example.com"
        />

      ) : (

        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800 break-all">
          {profile.companyWebsite ||
            "Not provided"}
        </div>

      )}

    </div>


    {/* LinkedIn */}

    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        Company LinkedIn
      </label>

      {editing ? (

        <input
          type="url"
          name="companyLinkedIn"
          value={formData.companyLinkedIn}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="https://linkedin.com/company/..."
        />

      ) : (

        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800 break-all">
          {profile.companyLinkedIn ||
            "Not provided"}
        </div>

      )}

    </div>

  </div>


            {/* Company Description */}

            <div className="mt-6">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                Company Description
                </label>

                {editing ? (

                <>

                    <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={5}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Tell candidates about your company..."
                    />

                    <p className="mt-1 text-right text-xs text-gray-400">
                    {formData.companyDescription.length}/1000
                    </p>

                </>

                ) : (

                <div className="min-h-[100px] rounded-lg bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">
                    {profile.companyDescription ||
                    "No company description added yet."}
                </div>

                )}

            </div>

            </div>


        {/* ------------------------------------------------
            Account Information
        ------------------------------------------------ */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-8">

          <h2 className="text-xl font-semibold text-gray-900">
            Account Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <div>

              <p className="text-sm text-gray-500">
                Account Role
              </p>

              <p className="mt-1 font-medium capitalize text-gray-800">
                {profile.role}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Member Since
              </p>

              <p className="mt-1 font-medium text-gray-800">

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

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default RecruiterProfile;
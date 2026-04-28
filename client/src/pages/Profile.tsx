import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, Save, UserRound } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

type ProfileData = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  profile_pic: string;
  skills: string[];
};

const emptyProfile: ProfileData = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  profile_pic: "",
  skills: [],
};

function Profile() {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [skillsInput, setSkillsInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/api/users/profile");
        const nextProfile = {
          ...emptyProfile,
          ...res.data,
          skills: res.data.skills || [],
        };

        setProfile(nextProfile);
        setSkillsInput((nextProfile.skills || []).join(", "));
      } catch (err) {
        console.error("Profile load failed:", err);
        setMessage("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleImageChange = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({
        ...current,
        profile_pic: String(reader.result || ""),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const payload = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        profile_pic: profile.profile_pic,
        skills: skillsInput
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const res = await api.put("/api/users/profile", payload);
      const updatedProfile = {
        ...emptyProfile,
        ...res.data.user,
        skills: res.data.user.skills || [],
      };

      setProfile(updatedProfile);
      setSkillsInput(updatedProfile.skills.join(", "));
      localStorage.setItem("username", updatedProfile.name);
      setEditMode(false);
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-500">Manage your learning identity.</p>
          </div>

          <button
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
            disabled={saving}
            className="gyano-button flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="gyano-glass-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
              {profile.profile_pic ? (
                <img
                  src={profile.profile_pic}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="text-blue-500" size={48} />
              )}
            </div>

            {editMode && (
              <label className="gyano-button mx-auto mb-4 flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800">
                <Camera size={16} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0])}
                />
              </label>
            )}

            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">No skills added yet.</span>
              )}
            </div>
          </div>

          <div className="gyano-glass-card p-6">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Name</label>
                <input
                  value={profile.name}
                  disabled={!editMode}
                  onChange={(e) =>
                    setProfile((current) => ({ ...current, name: e.target.value }))
                  }
                  className="input disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  value={profile.email}
                  readOnly
                  className="input bg-gray-100 text-gray-500"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <input
                  value={profile.phone || ""}
                  disabled={!editMode}
                  onChange={(e) =>
                    setProfile((current) => ({ ...current, phone: e.target.value }))
                  }
                  className="input disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">Bio</label>
                <textarea
                  value={profile.bio || ""}
                  disabled={!editMode}
                  rows={4}
                  onChange={(e) =>
                    setProfile((current) => ({ ...current, bio: e.target.value }))
                  }
                  className="input min-h-28 resize-y disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Skills
                </label>
                <input
                  value={skillsInput}
                  disabled={!editMode}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="React, Python, Data Science"
                  className="input disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export default Profile;

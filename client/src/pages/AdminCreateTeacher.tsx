import { useState } from "react";
import { ShieldCheck, UserPlus, Loader2 } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function AdminCreateTeacher() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateTeacher = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/admin/create-teacher", {
        name,
        email,
        password,
      });

      alert("Teacher account created successfully");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create teacher account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-xl">
              <ShieldCheck size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-blue-100 mt-2">
                Create teacher accounts from a protected admin-only workflow.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
              <UserPlus size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Create Teacher
              </h2>
              <p className="text-slate-500 text-sm">
                Teacher accounts can only be created by admins.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Teacher name"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@gyano.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Temporary password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleCreateTeacher}
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Teacher Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminCreateTeacher;

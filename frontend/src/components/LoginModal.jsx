"use client";
import { useState } from "react";
import { apiJson } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await apiJson(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      login(res.token, res.user);
      onClose();
      setUsername("");
      setPassword("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">{mode === "login" ? "Se connecter" : "Créer un compte"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            type="password"
            className="w-full border rounded p-2"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-pink-600 text-white rounded py-2 hover:bg-pink-700 disabled:opacity-60"
          >
            {loading ? "..." : mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
          <p className="text-sm text-center text-gray-600">
            {mode === "login" ? (
              <>
                Pas de compte ?{" "}
                <button type="button" onClick={() => setMode("register")} className="text-pink-600 underline">
                  S’inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-pink-600 underline">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}


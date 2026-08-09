"use client";

import { useEffect, useState } from "react";

type Props = {
  onClose?: () => void;
};

export default function SettingsMenu({ onClose }: Props) {
  const [showMyPosts, setShowMyPosts] = useState<boolean>(() =>
    typeof window !== "undefined" ? localStorage.getItem("vf.showMyPosts") === "1" : true
  );
  const [showVoting, setShowVoting] = useState<boolean>(() =>
    typeof window !== "undefined" ? localStorage.getItem("vf.showVoting") !== "0" : true
  );
  const [confirmTheme, setConfirmTheme] = useState<boolean>(() =>
    typeof window !== "undefined" ? localStorage.getItem("vf.confirmTheme") === "1" : false
  );

  useEffect(() => {
    try {
      localStorage.setItem("vf.showMyPosts", showMyPosts ? "1" : "0");
      localStorage.setItem("vf.showVoting", showVoting ? "1" : "0");
      localStorage.setItem("vf.confirmTheme", confirmTheme ? "1" : "0");
    } catch {
      // ignore
    }
  }, [showMyPosts, showVoting, confirmTheme]);

  return (
    <div className="vf-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Settings</h3>
        <button onClick={onClose} className="text-xs text-slate-400">Close</button>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showMyPosts}
            onChange={(e) => setShowMyPosts(e.target.checked)}
          />
          <span className="text-sm">Show "My Posts" in sidebar</span>
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showVoting} onChange={(e) => setShowVoting(e.target.checked)} />
          <span className="text-sm">Show "Voting" in sidebar</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmTheme}
            onChange={(e) => setConfirmTheme(e.target.checked)}
          />
          <span className="text-sm">Require confirmation for theme changes</span>
        </label>
      </div>
    </div>
  );
}

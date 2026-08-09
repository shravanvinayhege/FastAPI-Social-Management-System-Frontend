"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { createPost, getCurrentUserId, getUser } from "../../lib/api";
import Avatar from "./Avatar";

type ComposerProps = {
  onCreate: (post: any) => void;
};

export default function Composer({ onCreate }: ComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);
    try {
      const created = await createPost(title, content, true);
      onCreate(created);
      setTitle("");
      setContent("");
    } catch (err) {
      // swallow — parent can refresh
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const id = getCurrentUserId();
    if (!id) return;
    getUser(id).then((u) => setUser(u)).catch(() => setUser(null));
  }, []);

  return (
    <form onSubmit={submit} className="vf-card rounded-[1.25rem] p-4" aria-label="Create post">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {user ? <div className="pt-1"><Avatar size={40} email={user.email} id={user.id} /></div> : <div className="h-10 w-10 rounded-full bg-slate-700" />}
        </div>
        <div className="flex-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus-visible"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="What's happening?"
            className="mt-2 w-full resize-none rounded-md border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus-visible"
          />

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-300">
              <button type="button" className="p-2 rounded-md hover:bg-white/5 focus-visible">📎</button>
              <button type="button" className="p-2 rounded-md hover:bg-white/5 focus-visible">🖼️</button>
              <button type="button" className="p-2 rounded-md hover:bg-white/5 focus-visible">🔗</button>
            </div>

            <div className="flex-shrink-0">
              <button
                type="submit"
                disabled={isSubmitting}
                className="vf-btn-primary px-4 py-2 text-sm disabled:opacity-60 focus-visible"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

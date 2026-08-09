"use client";

import React, { FormEvent, useState } from "react";
import { createPost } from "../../lib/api";

type ComposerProps = {
  onCreate: (post: any) => void;
};

export default function Composer({ onCreate }: ComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);
    try {
      const created = await createPost(title, content, true);
      onCreate(created);
      setTitle("");
      setContent("");
      setExpanded(false);
    } catch (err) {
      // swallow — parent can refresh
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="vf-card rounded-[1.25rem] p-4" aria-label="Create post">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="What's happening?"
            className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus-visible"
          />
          {expanded ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Share something with the community"
              className="mt-2 w-full resize-none rounded-md border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus-visible"
            />
          ) : null}
        </div>

        <div className="flex shrink-0 items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="vf-btn-primary px-4 py-2 text-sm disabled:opacity-60 focus-visible"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}

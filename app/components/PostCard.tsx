"use client";

import { useState } from "react";
import { vote } from "../../lib/api";

type PostCardProps = {
  title: string;
  content: string;
  votes: number;
  postId: number;
  postedBy: string;
  postedAt: string;
  isOwner?: boolean;
  onDelete?: (postId: number) => Promise<void>;
  onUpdate?: (postId: number, title: string, content: string) => Promise<void>;
};

export default function PostCard({
  title,
  content,
  votes,
  postId,
  postedBy,
  postedAt,
  isOwner = false,
  onDelete,
  onUpdate,
}: PostCardProps) {
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [isVoting, setIsVoting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [error, setError] = useState("");

  const handleVote = async (dir: 0 | 1) => {
    if (isVoting) {
      return;
    }

    setIsVoting(true);
    setError("");

    try {
      await vote(postId, dir);
      setCurrentVotes((prev) => (dir === 1 ? prev + 1 : Math.max(0, prev - 1)));
    } catch (voteError) {
      const message = voteError instanceof Error ? voteError.message : "Unable to submit vote.";
      setError(message);
    } finally {
      setIsVoting(false);
    }
  };

  const handleSave = async () => {
    if (!onUpdate || isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await onUpdate(postId, editTitle, editContent);
      setIsEditing(false);
    } catch (updateError) {
      const message =
        updateError instanceof Error ? updateError.message : "Unable to update post.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await onDelete(postId);
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Unable to delete post.";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="vf-card group rounded-[2rem] p-6 transition duration-300 hover:border-cyan-400/30 hover:shadow-cyan-900/30">
      {isEditing ? (
        <div className="space-y-3">
          <input
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            className="w-full rounded-lg border border-white/15 bg-slate-800/80 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
          <textarea
            value={editContent}
            onChange={(event) => setEditContent(event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-white/15 bg-slate-800/80 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </div>
      ) : (
        <>
          <h2 className="font-[var(--font-space-grotesk)] text-xl font-semibold text-white group-hover:text-cyan-100">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{content}</p>
        </>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/15 px-3 py-1 text-sm font-medium text-cyan-200">
          Votes: {currentVotes}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleVote(1)}
            disabled={isVoting}
            className="vf-btn-success px-3 py-2 text-sm transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Upvote
          </button>
          <button
            type="button"
            onClick={() => void handleVote(0)}
            disabled={isVoting}
            className="vf-btn-danger px-3 py-2 text-sm transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Remove Vote
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="vf-meta-chip px-3 py-1">By: {postedBy}</span>
        <span className="vf-meta-chip px-3 py-1">Posted: {postedAt}</span>
      </div>

      {isOwner ? (
        <div className="mt-4 flex gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="vf-btn-primary px-3 py-2 text-xs hover:bg-cyan-300 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(title);
                  setEditContent(content);
                }}
                className="vf-btn-secondary px-3 py-2 text-xs hover:bg-white/10"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="vf-btn-secondary px-3 py-2 text-xs hover:bg-cyan-500/20"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="vf-btn-danger px-3 py-2 text-xs hover:bg-rose-500/20 disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-xs text-rose-300">{error}</p> : null}
    </article>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostCard from "./components/PostCard";
import ThemeToggle from "./components/ThemeToggle";
import {
  createPost,
  deletePost,
  getCurrentUserId,
  getPosts,
  getToken,
  logout,
  PostWithVotes,
  updatePost,
} from "../lib/api";

function formatPostedTime(timestamp: string): string {
  if (!timestamp) {
    return "Unknown time";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithVotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setCurrentUserId(getCurrentUserId());

    const loadPosts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getPosts();
        setPosts(response);
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Unable to load posts right now.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadPosts();
  }, [router]);

  useEffect(() => {
    const handleWindowScroll = () => {
      setShowScrollTop(window.scrollY > 260);
    };

    handleWindowScroll();
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const created = await createPost(title, content, true);
      setPosts((prev) => [{ Post: created, votes: 0 }, ...prev]);
      setTitle("");
      setContent("");
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to create post right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    await deletePost(postId);
    setPosts((prev) => prev.filter((post) => post.Post.id !== postId));
  };

  const handleUpdatePost = async (postId: number, nextTitle: string, nextContent: string) => {
    const updated = await updatePost(postId, nextTitle, nextContent, true);
    setPosts((prev) =>
      prev.map((post) => (post.Post.id === postId ? { ...post, Post: updated } : post))
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen px-4 py-6 text-slate-100 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
        <header id="overview-section" className="vf-card rounded-[1.75rem] p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.45em] text-cyan-300">VoteFlow</p>
              <h1 className="mt-3 font-[var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Community Posts
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                A polished social feed with posting, voting, and personal content management.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <ThemeToggle />
              <Link
                href="/register"
                className="vf-btn-primary px-4 py-2 text-sm hover:brightness-105"
              >
                New Account
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="vf-btn-secondary px-4 py-2 text-sm hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
              Smooth interactions
            </span>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
              Responsive layout
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
              Light and dark themes
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Feed</p>
              <p className="mt-1 font-medium text-white">All posts in one place</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">My Posts</p>
              <p className="mt-1 font-medium text-white">Your own content section</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Voting</p>
              <p className="mt-1 font-medium text-white">Upvote and save momentum</p>
            </div>
          </div>
        </header>

        <section id="create-post-section" className="vf-card rounded-[1.75rem] p-5 sm:p-6 lg:p-8">
          <h2 className="font-[var(--font-space-grotesk)] text-xl font-semibold text-white">Create Post</h2>
          <form onSubmit={handleCreatePost} className="mt-4 space-y-4">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Post title"
              required
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              required
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="vf-btn-primary px-5 py-2.5 text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Posting..." : "Create Post"}
            </button>
          </form>
        </section>

        {isLoading ? (
          <div className="vf-card rounded-[2rem] p-6 text-sm text-slate-200">
            Loading posts...
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-[2rem] border border-red-400/40 bg-red-500/10 p-6 text-sm text-red-200 backdrop-blur-xl">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && posts.length === 0 ? (
          <div className="vf-card rounded-[2rem] p-6 text-sm text-slate-300">
            No posts available yet.
          </div>
        ) : null}

        {!isLoading && !error && posts.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            <section id="my-posts-section" className="vf-card rounded-[1.75rem] p-5 sm:p-6 lg:p-8">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-[var(--font-space-grotesk)] text-2xl font-semibold text-white">
                    My Posts
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">
                    Posts created by your account are shown here.
                  </p>
                </div>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-200">
                  {posts.filter((post) => post.Post.owner_id === currentUserId).length} items
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-2">
                {posts
                  .filter((post) => post.Post.owner_id === currentUserId)
                  .map((post) => (
                    <PostCard
                      key={post.Post.id}
                      postId={post.Post.id}
                      title={post.Post.title}
                      content={post.Post.content}
                      votes={post.votes}
                      postedBy={post.Post.owner?.email ?? "Unknown user"}
                      postedAt={formatPostedTime(post.Post.created_at)}
                      isOwner={currentUserId === post.Post.owner_id}
                      onDelete={handleDeletePost}
                      onUpdate={handleUpdatePost}
                    />
                  ))}
              </div>

              {posts.filter((post) => post.Post.owner_id === currentUserId).length === 0 ? (
                <p className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-4 text-sm text-slate-300">
                  You have not created any posts yet. Use the create form above to publish your
                  first one.
                </p>
              ) : null}
            </section>

            <section id="all-posts-section" className="vf-card rounded-[1.75rem] p-5 sm:p-6 lg:p-8">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-[var(--font-space-grotesk)] text-2xl font-semibold text-white">
                    All Posts
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">
                    Explore the full feed and interact with the community.
                  </p>
                </div>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                  {posts.length} total
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-2">
                {posts.map((post) => (
                  <PostCard
                    key={post.Post.id}
                    postId={post.Post.id}
                    title={post.Post.title}
                    content={post.Post.content}
                    votes={post.votes}
                    postedBy={post.Post.owner?.email ?? "Unknown user"}
                    postedAt={formatPostedTime(post.Post.created_at)}
                    isOwner={currentUserId === post.Post.owner_id}
                    onDelete={handleDeletePost}
                    onUpdate={handleUpdatePost}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </div>

      {showScrollTop ? (
        <button
          type="button"
          onClick={handleScrollToTop}
          className="vf-btn-primary fixed bottom-4 right-4 z-50 px-3 py-2 text-xs shadow-xl sm:bottom-6 sm:right-6 sm:px-4 sm:py-3 sm:text-sm"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          Scroll to top
        </button>
      ) : null}

    </main>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostCard from "./components/PostCard";
import ThemeToggle from "./components/ThemeToggle";
import Composer from "./components/Composer";
import FeedTabs from "./components/FeedTabs";
// useSearchParams avoided to prevent prerender/suspense issues; use window.location in client effect
import { Loading, Empty, ErrorBanner } from "./components/Feedback";
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
import BottomNav from "./components/BottomNav";

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
    const loadPosts = async (opts = {}) => {
      setIsLoading(true);
      setError("");
      try {
        const response = await getPosts(opts as any);
        setPosts(response);
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Unable to load posts right now.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    const q = typeof window !== "undefined" ? new URL(window.location.href).searchParams.get("q") ?? "" : "";
    if (q) {
      void loadPosts({ search: q, limit: 50, skip: 0 });
    } else {
      void loadPosts({ limit: 20, skip: 0 });
    }
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

  const handleSearch = async (q: string) => {
    setIsLoading(true);
    try {
      const results = await getPosts({ search: q, limit: 50 });
      setPosts(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [mode, setMode] = useState<"new" | "top">("new");

  const handleModeChange = (m: "new" | "top") => {
    setMode(m);
    if (m === "new") {
      void (async () => {
        setIsLoading(true);
        try {
          const results = await getPosts({ limit: 20, skip: 0 });
          setPosts(results);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unable to load posts");
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      // Top: sort client-side by votes
      setPosts((prev) => [...prev].sort((a, b) => b.votes - a.votes));
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen px-4 py-6 text-slate-100 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 space-y-4 hidden lg:block">
            <nav className="vf-card p-4 sticky top-20" aria-label="Primary">
              <ul className="mt-1 space-y-2">
                <li>
                  <button
                    onClick={() => handleModeChange("new")}
                    className="w-full text-left rounded-md px-3 py-2 hover:bg-white/5 focus-visible flex items-center gap-3"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-none">
                      <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Feed</span>
                  </button>
                </li>
                {/* 'My Posts' removed per request */}
                <li>
                  <button
                    onClick={() => handleModeChange("top")}
                    className="w-full text-left rounded-md px-3 py-2 hover:bg-white/5 focus-visible flex items-center gap-3"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-none">
                      <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Voting</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <section className="lg:col-span-6 lg:col-start-4 space-y-6">
            <header id="overview-section" className="vf-card rounded-[1.5rem] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="mt-0 font-[var(--font-space-grotesk)] text-2xl font-semibold tracking-tight text-white">
                    Community Posts
                  </h1>
                </div>
              </div>
            </header>

        <section className="space-y-4">
          <div className="mx-auto max-w-[700px]">
          <div className="flex items-center justify-between">
            <div className="">
              <FeedTabs mode={mode} onChange={handleModeChange} />
            </div>
            <div className="text-sm text-slate-400 hidden sm:block">Search moved to top header</div>
          </div>

          <Composer
            onCreate={(created) => setPosts((prev) => [{ Post: created, votes: 0 }, ...prev])}
          />
          </div>
        </section>

        {isLoading ? <Loading label="Loading posts..." /> : null}

        {!isLoading && error ? <ErrorBanner message={error} /> : null}

        {!isLoading && !error && posts.length === 0 ? (
          <Empty title="No posts yet" message="Be the first to create a post." />
        ) : null}

        {!isLoading && !error && posts.length > 0 ? (
          <div className="space-y-4 mx-auto max-w-[700px]">
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
        ) : null}

          </section>
        </div>
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

      <BottomNav />

    </main>
  );
}

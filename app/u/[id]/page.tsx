import { Metadata } from "next";
import { getUser, getPosts } from "../../../lib/api";
import PostCard from "../../components/PostCard";
import { Loading, Empty, ErrorBanner } from "../../components/Feedback";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `User ${params.id} — Profile` };
}

export default async function UserPage({ params }: Props) {
  const id = Number(params.id);
  let user;
  try {
    user = await getUser(id);
  } catch (err) {
    return <ErrorBanner message={"Unable to load user."} />;
  }

  // fetch feed and filter client-side for this user's posts (API doesn't offer owner filter)
  let posts = [] as any[];
  try {
    posts = await getPosts({ limit: 50 });
    posts = posts.filter((p) => p.Post.owner_id === id);
  } catch (e) {
    return <ErrorBanner message={"Unable to load user's posts."} />;
  }

  return (
    <div className="space-y-6">
      <section className="vf-card p-6">
        <h1 className="text-2xl font-semibold">{user.email}</h1>
        <p className="text-sm text-slate-300 mt-1">Joined: {new Date(user.created_at).toLocaleString()}</p>
      </section>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <Empty title="No posts from this user" message="This user hasn't posted yet." />
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.Post.id}
              postId={post.Post.id}
              title={post.Post.title}
              content={post.Post.content}
              votes={post.votes}
              postedBy={post.Post.owner?.email ?? "Unknown"}
              postedAt={new Date(post.Post.created_at).toLocaleString()}
            />
          ))
        )}
      </section>
    </div>
  );
}

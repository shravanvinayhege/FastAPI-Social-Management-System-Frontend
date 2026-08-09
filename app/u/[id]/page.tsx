import { Metadata } from "next";
import UserClient from "./UserClient";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `User ${params.id} — Profile` };
}

export default function UserPage({ params }: Props) {
  const id = Number(params.id);
  return <UserClient id={id} />;
}

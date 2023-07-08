import { firestore } from "@/firebase/firebase";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  session: Session | null;
};

function NewChat({ session }: Props) {
  const router = useRouter();

  const createNewChat = async () => {
    try {
      if (!session) return;

      const doc = await addDoc(
        collection(firestore, `users/${session.user.uid}/chats`),
        {
          userId: session.user.uid,
          userEmail: session.user.email,
          createdAt: serverTimestamp() as Timestamp,
        }
      );

      if (!doc.id) return;

      router.push(`/chat/${doc.id}`);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="chatRow border-gray-700 border" onClick={createNewChat}>
      <PlusIcon className="h-4 2-4" />
      <p>New Chat</p>
    </div>
  );
}

export default NewChat;

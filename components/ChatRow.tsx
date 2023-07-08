import { firestore } from "@/firebase/firebase";
import { collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

type Props = {
  id: string;
  session: Session | null;
};

function ChatRow({ id, session }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(false);

  const [messages] = useCollection(
    query(
      collection(
        firestore,
        `users/${session?.user?.uid!}/chats/${id}/messages`
      ),
      orderBy("createdAt", "asc")
    )
  );

  useEffect(() => {
    if (!pathname) return;

    setActive(pathname.includes(id));
  }, [pathname]);

  const removeChat = async () => {
    await deleteDoc(doc(firestore, `users/${session?.user?.uid!}/chats/${id}`));
    router.replace("/");
  };

  return (
    <Link
      href={`/chat/${id}`}
      className={`chatRow justify-center ${active && "bg-gray-700/50"}`}
    >
      <ChatBubbleLeftIcon className="h-5 w-5" />
      <p className="flex-1 hidden md:inline-flex truncate">
        {messages?.docs[messages?.docs.length - 1]?.data().text || "New Chat"}
      </p>
      <TrashIcon
        onClick={removeChat}
        className="h-5 w-5 text-gray-700 hover:text-red-700"
      />
    </Link>
  );
}

export default ChatRow;

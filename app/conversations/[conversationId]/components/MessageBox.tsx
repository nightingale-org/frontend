"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { MessageWithSenderAndSeen } from "@/app/@types";

import Avatar from "@/app/components/Avatar";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  messageBody: MessageWithSenderAndSeen;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  messageBody: messages,
  isLast,
}) => {
  const session = useSession({ required: true });
  const [imageModalOpen, setImageModalOpen] = useState(false);

  if (session.status === "loading") return null;

  const isOwn = session.data?.user?.email === messages?.sender?.email;
  const seenList = (messages.seen || [])
    .filter((user) => user.email !== messages?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    messages.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={messages.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{messages.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(messages.createdAt), "p")}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={messages.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {messages.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)}
              src={messages.image}
              className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
            />
          ) : (
            <div>{messages.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
            text-xs 
            font-light 
            text-gray-500
            "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;

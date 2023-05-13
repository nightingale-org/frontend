"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";

import Avatar from "@/components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import AvatarGroup from "@/components/AvatarGroup";
import { ConversationWithUserAndMessages, MessageWithSeen } from "../../../@types";

interface ConversationBoxProps {
  conversation: ConversationWithUserAndMessages;
  selected?: boolean;
  userEmail?: string | null;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  conversation,
  selected,
  userEmail,
}) => {
  // TODO: n + 1 fix
  const otherUser = useOtherUser(conversation);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/conversations/${conversation.id}`);
  };

  const lastMessage = conversation.messages.at(-1) as
    | MessageWithSeen
    | undefined;

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full
        relative
        flex
        items-center
        space-x-3
        p-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {conversation.isGroup ? (
        <AvatarGroup users={conversation.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {conversation.name || (otherUser ? otherUser.name : "error")}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs
                  text-gray-400
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
              `,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;

import { getServerSession } from "next-auth";
import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
  }) {
  const [conversations, users, session] = await Promise.all([
    getConversations(),
    getUsers(),
    getServerSession()
  ])

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        <ConversationList 
          users={users} 
          title="Messages" 
          conversations={conversations}
          userEmail={session?.user?.email}
        />
        {children}
      </div>
    </Sidebar>
  );
}

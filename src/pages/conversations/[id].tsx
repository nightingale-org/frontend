// import EmptyState from "@/components/EmptyState";
// import {GetStaticProps} from "next";
// import Form from "@/components/Form";
// import Header from "@/components/Header";
// import {Conversation, Message} from "@/@types";
// import {getConversationById} from "@/lib/api";
//
// interface IParams {
//   conversationId: string;
//
//   [key: string]: string;
// }
//
// interface ConversationProps {
//   conversation: Conversation;
// }
//
// const Conversation = ({params, conversation}: ConversationProps & { params: IParams }) => {
//
//   if (!conversation) {
//     return (
//       <div className="h-full lg:pl-80">
//         <div className="flex h-full flex-col">
//           <EmptyState/>
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="h-full lg:pl-80">
//       <div className="flex h-full flex-col">
//         <Header conversation={conversation}/>
//         <Body initialMessages={conversation.messages}/>
//         <Form/>
//       </div>
//     </div>
//   );
// };
//
// export const getStaticProps: GetStaticProps<ConversationProps, IParams> = async ({params}) => {
//   const conversation = await getConversationById(params.conversationId);
//
//   return {
//     props: {
//       conversation: conversation,
//     }
//   }
// }
//
// export default Conversation;

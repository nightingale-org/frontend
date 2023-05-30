import {getServerSession} from 'next-auth';
import {get} from "@/libs/fetch-wrapper/fetch";
import {User} from "@/types";

const getUsers = async (): Promise<User[]> => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return [];
  }

  return await get<User[]>(`http://localhost:8000/api/v1/users/connections/${session.user.email}`);
};

export default getUsers;

import { getServerSession } from 'next-auth';
import { User } from '@prisma/client';
import { get } from '@/libs/fetch-wrapper/fetch';
import { env } from '@/env';


const getCurrentUser = async (): Promise<User | null> => {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return null;
    }

    return await get(`${env.USER_SERVICE_API_URL}/?email=${session.user.email}`)
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;

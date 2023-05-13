import prisma from '@/libs/prismadb';
import { getServerSession } from 'next-auth';
import { User } from '@prisma/client';

const getCurrentUser = async (): Promise<User | null> => {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return null;
    }

    return await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;

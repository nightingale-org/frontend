import { NextResponse } from 'next/server';

import getCurrentUser from '@/actions/getCurrentUser';
import { patch } from '@/libs/fetch-wrapper/fetch';
import { env } from '@/env';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { name, image } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await patch(`${env.USER_SERVICE_API_URL}/${currentUser.id}/`, {
      image,
      name
    })

    return new NextResponse(null, {status: 204})
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Error', { status: 500 });
  }
}

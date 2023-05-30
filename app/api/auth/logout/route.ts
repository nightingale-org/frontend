import {NextResponse} from "next/server";
import {env} from "@/env";

export async function GET() {
  const indexUrl = encodeURI("http://localhost:8080")
  return NextResponse.redirect(`${env.AUTH0_DOMAIN}/v2/logout?client_id=${env.AUTH0_CLIENT_ID}&returnTo=${indexUrl}`);
}

import type { NextRequest } from "next/server";
import {
  authJson,
  handleAuthPost,
  setRefreshCookie,
  setStateCookie,
} from "@/app/_utils/authServer";

export async function POST(request: NextRequest) {
  return handleAuthPost(request, (request) => {
    const response = authJson({ loggedOut: true });
    setRefreshCookie(response, request, "");
    setStateCookie(response, request, "");
    return response;
  });
}

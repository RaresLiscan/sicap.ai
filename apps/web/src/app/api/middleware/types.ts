import { NextRequest, NextResponse } from "next/server";

export type NextHandler<T = unknown> = (
  req: NextRequest,
  arg?: T,
) => Promise<Response> | Promise<NextResponse> | NextResponse | Response | T;

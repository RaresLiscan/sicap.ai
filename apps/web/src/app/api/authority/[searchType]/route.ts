import {
  ES_INDEX_DIRECT,
  ES_INDEX_OFFLINE,
  ES_INDEX_PUBLIC,
  searchAuthorityAquisitions,
  searchAuthorityLicitatii,
  searchAuthorityOffline,
} from "@sicap/api";
import { withBearerToken } from "../../middleware/withBearerToken";

type RouteParams = {
  searchType: string;
};

export const GET = withBearerToken(async (request, context: { params: RouteParams }) => {
  const searchParams = new URLSearchParams(request.url?.split("?")[1]);
  const searchType = context?.params?.searchType;

  const authorityFiscalCode = searchParams.get("authorityFiscalCode");
  const pitId = searchParams.get("pitId");
  const searchAfter = searchParams.get("searchAfter");

  if (!authorityFiscalCode || !pitId) {
    return new Response("Missing authorityFiscalCode or pitId", { status: 400 });
  }

  switch (searchType) {
    case ES_INDEX_DIRECT: {
      return Response.json(
        await searchAuthorityAquisitions(authorityFiscalCode, pitId, searchAfter),
      );
    }
    case ES_INDEX_OFFLINE:
      return Response.json(await searchAuthorityOffline(authorityFiscalCode, pitId, searchAfter));
    case ES_INDEX_PUBLIC:
      return Response.json(await searchAuthorityLicitatii(authorityFiscalCode, pitId, searchAfter));
    default:
      return new Response("Invalid searchType", { status: 400 });
  }
});

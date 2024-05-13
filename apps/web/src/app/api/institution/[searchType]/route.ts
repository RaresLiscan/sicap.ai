import {
  ES_INDEX_DIRECT,
  ES_INDEX_OFFLINE,
  ES_INDEX_PUBLIC,
  searchInstitutionAquisitions,
  searchInstitutionLicitatii,
  searchInstitutionOffline,
} from "@sicap/api";
import { withBearerToken } from "../../middleware/withBearerToken";

type RouteParams = {
  searchType: string;
};

export const GET = withBearerToken(async (request, context: { params: RouteParams }) => {
  const searchParams = new URLSearchParams(request.url?.split("?")[1]);
  const searchType = context?.params?.searchType;

  const institutionFiscalCode = searchParams.get("institutionFiscalCode");
  const pitId = searchParams.get("pitId");
  const searchAfter = searchParams.get("searchAfter");

  if (!institutionFiscalCode || !pitId) {
    return new Response("Missing institutionFiscalCode or pitId", { status: 400 });
  }

  switch (searchType) {
    case ES_INDEX_DIRECT: {
      return Response.json(
        await searchInstitutionAquisitions(institutionFiscalCode, pitId, searchAfter),
      );
    }
    case ES_INDEX_OFFLINE:
      return Response.json(
        await searchInstitutionOffline(institutionFiscalCode, pitId, searchAfter),
      );
    case ES_INDEX_PUBLIC:
      return Response.json(
        await searchInstitutionLicitatii(institutionFiscalCode, pitId, searchAfter),
      );
    default:
      return new Response("Invalid searchType", { status: 400 });
  }
});

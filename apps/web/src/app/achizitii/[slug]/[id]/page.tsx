import { Suspense } from "react";

import { getCompanyAchizitii } from "@sicap/api";
import { CompanyAchizitii } from "@/components/company-achizitii";
import { allowedSlugs, moneyRon } from "@/utils";
import { type SearchParams } from "@/components";
import { type SLUG } from "@/utils/types";

interface PageProps {
  params: {
    id: string;
    slug: SLUG;
  };
  searchParams: SearchParams;
}

export async function generateMetadata(props: PageProps) {
  const {
    params: { id, slug },
  } = props;

  if (!allowedSlugs.includes(slug)) {
    throw new Error("Adresa invalida");
  }

  const companyProps = slug === "firma" ? { supplierId: id } : { authorityId: id };
  const { total, stats, contractingAuthority, supplier } = await getCompanyAchizitii(companyProps);
  const totalValue = stats?.years.map((y) => y.value).reduce((a, b) => a + b, 0);
  const totalValueRon = moneyRon(totalValue);

  const title =
    slug === "firma"
      ? `${supplier.entityName}, ${supplier.city} `
      : `${contractingAuthority.entityName}, ${contractingAuthority.city}`;

  return {
    title: `${title}  | Achizitii directe @ SICAP.ai`,
    description: `${total} achizitii in valoare de ${totalValueRon}`,
  };
}

export default async function Page(props: PageProps) {
  const {
    params: { id, slug },
    searchParams,
  } = props;

  return (
    <main className="container px-8 py-4 flex flex-col gap-2 lg:max-w-7xl">
      <Suspense fallback={<div className="text-sm">se incarca...</div>}>
        <CompanyAchizitii id={id} slug={slug} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
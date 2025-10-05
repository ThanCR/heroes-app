import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { SearchControls } from "./ui/SearchControls"
import { CustomBreadcrums } from "@/components/custom/CustomBreadcrums"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { useSearchParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { searchHeroesAction } from "@/heroes/actions/search-heroes.action"

export const SearchPage = () => {

  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? undefined;
  const strength = searchParams.get('strength') ?? undefined;
  const { data: heroesData } = useQuery({
    queryKey: ['search', { name, strength }],
    queryFn: () => searchHeroesAction({ name, strength }),
    staleTime: 1000 * 60 * 5,
    retry: false
  });


  return (
    <div>
      <CustomJumbotron
        title="Busqueda de super heroes"
        description="Descubre, explora y administra super heroes"
      />
      <CustomBreadcrums currentPage="Busqueda" />
      <HeroStats />

      <SearchControls />

      <HeroGrid heroes={heroesData ?? []} />

    </div>
  )
}

export default SearchPage

import { use, useMemo } from "react"
import { useSearchParams } from "react-router"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { TabsContent } from "@radix-ui/react-tabs"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomBreadcrums } from "@/components/custom/CustomBreadcrums"
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary"
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero"
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext"


export const HomePage = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') ?? 'all';
  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '6';
  const category = searchParams.get('category') ?? 'all';

  const selectedTab = useMemo(() => {
    const validTabs = ['all', 'favorites', 'heroes', 'villains'];
    return validTabs.includes(activeTab) ? activeTab : 'all';
  }, [activeTab])


  const { data: heroesResponse } = usePaginatedHero(+page, +limit, category);

  const { data: summary } = useHeroSummary();

  const { favoritesCount, favorites } = use(FavoriteHeroContext);
  
  // en vez de esto se utiliza tanstack query para evitar usar efectos
  // useEffect(() => {
  //   getHeroesByPage().then();
  // }, [])


  return (
    <>
      <>
        <CustomJumbotron
          title="Universo de super heroes"
          description="Descubre, explora y administra super heroes"
        />
        <CustomBreadcrums currentPage="" />

        <HeroStats />

        {/* Tabs */}
        <Tabs value={selectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2"
              onClick={() => setSearchParams(prev => {
                prev.set('tab', 'all');
                prev.set('category', 'all');
                prev.set('page', '1');
                return prev;
              })
              }>All Characters ({summary?.totalHeroes})</TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex items-center gap-2"
              onClick={() =>
                setSearchParams(prev => {
                  prev.set('tab', 'favorites');
                  return prev;
                })
              }>Favorites ({favoritesCount})</TabsTrigger>
            <TabsTrigger
              value="heroes"
              className="flex items-center gap-2"
              onClick={() => setSearchParams(prev => {
                prev.set('tab', 'heroes');
                prev.set('category', 'hero');
                prev.set('page', '1');
                return prev;
              })
              }>Heroes ({summary?.heroCount})</TabsTrigger>
            <TabsTrigger
              value="villains"
              className="flex items-center gap-2"
              onClick={() => setSearchParams(prev => {
                prev.set('tab', 'villains');
                prev.set('category', 'villain');
                prev.set('page', '1');
                return prev;
              })
              }>Villains ({summary?.villainCount})</TabsTrigger>
          </TabsList>

          <TabsContent value='all'>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
          <TabsContent value='favorites'>
            <HeroGrid heroes={favorites} />
          </TabsContent>
          <TabsContent value='heroes'>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
          <TabsContent value='villains'>
            <HeroGrid heroes={heroesResponse?.heroes ?? []} />
          </TabsContent>
        </Tabs>

        {
          selectedTab !== 'favorites' && (
            <CustomPagination
              totalPages={heroesResponse?.pages ?? 1}
            />
          )
        }

      </>
    </>
  )
}
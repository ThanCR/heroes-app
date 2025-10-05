import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Hero } from "../types/hero.interface";


interface FavoriteHeroContext {
    //State
    favorites: Hero[],
    favoritesCount: number;


    //Methods
    toggleFavorite: (hero: Hero) => void;
    isFavorite: (hero: Hero) => boolean;
}

//Context
export const FavoriteHeroContext = createContext({} as FavoriteHeroContext);

const getFavoritesFromLocalStorage = (): Hero[] => {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites): [];
}

//Provider
export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {

    const [favorites, setFavorites] = useState<Hero[]>(getFavoritesFromLocalStorage());

    const toggleFavorite = (hero: Hero) => {
        const heroExist = favorites.find( h => h.id === hero.id);
        if(heroExist){
            const newFavoritesArray = favorites.filter(h => h.id !== hero.id );
            setFavorites(newFavoritesArray);
            return;
        }
        setFavorites([...favorites, hero]);
    }

    const isFavorite = (hero: Hero) => {
        return favorites.some(h => h.id === hero.id)
    }

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites])
    

    return (
        <FavoriteHeroContext value={
            {
                //State
                favoritesCount: favorites.length,
                favorites: favorites,
                //Methods
                isFavorite: isFavorite,
                toggleFavorite: toggleFavorite
            }
        }
        >
            {children}
        </FavoriteHeroContext>
    )
}


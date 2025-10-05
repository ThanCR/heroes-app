import { use } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "./FavoriteHeroContext";
import type { Hero } from "../types/hero.interface";


const mockHero = {
    id: '1',
    alias: 'batman'
} as Hero


const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

// We create a test component that will be fed with the context I need to simulate
const TestComponent = () => {

    const { favoritesCount, favorites, isFavorite, toggleFavorite } = use(FavoriteHeroContext);

    return (
        <div>

            <div data-testid='favorite-count'>{favoritesCount}</div>

            <div data-testid='favorite-list'>
                {favorites.map(favorite => (
                    <div key={favorite.id} data-testid={`hero-${favorite.id}`}>
                        {favorite.alias}
                    </div>
                ))}
            </div>

            <button data-testid="toggle-favorite"
                onClick={() => toggleFavorite(mockHero)}
            >
                Toggle Favorite
            </button>

            <div
                data-testid="is-favorite"
            >
                {isFavorite(mockHero).toString()}
            </div>

        </div>
    )
}

const renderContextTest = () => {
    return render(
        <FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>
    );
}



describe('FavoriteHeroContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
    test('should initialize with default values', () => {

        renderContextTest();
        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('favorite-list').children.length).toBe(0);
    })

    test('should add hero to favorites when toggleFavorite is called', () => {
        renderContextTest();
        const button = screen.getByTestId('toggle-favorite');
        expect(button).toBeDefined();
        fireEvent.click(button);
        expect(screen.getByTestId('favorite-count').textContent).toBe('1');
        expect(screen.getByTestId('is-favorite').textContent).toBeTruthy();
        expect(screen.getByTestId('hero-1').textContent).toBe('batman');

        expect(localStorageMock.setItem).toHaveBeenCalled();
        expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[{"id":"1","alias":"batman"}]');


    })

    test('should remove hero to favorites when toggleFavorite is called', () => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

        renderContextTest();
        const button = screen.getByTestId('toggle-favorite');

        fireEvent.click(button);

        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('is-favorite').textContent).toBe('false');
        expect(screen.queryByTestId('hero-1')).toBeNull();

        expect(localStorageMock.setItem).toHaveBeenCalled();
        expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[]')
    })
})

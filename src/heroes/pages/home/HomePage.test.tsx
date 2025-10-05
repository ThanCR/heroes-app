import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "./HomePage";
import { MemoryRouter } from "react-router";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";

// this is how to mock a custom hook use
vi.mock('@/heroes/hooks/usePaginatedHero');
const mockUsePaginatedHero = vi.mocked(usePaginatedHero);

// this is to mock the return value of that mocked custom hook
mockUsePaginatedHero.mockReturnValue({
    data: [],
    isloading: false,
    isError: false,
    isSuccess: true
} as unknown as ReturnType<typeof mockUsePaginatedHero>);


// the mocked scenario requires a query client to wrap the component.
const queryClient = new QueryClient();


const renderHomePage = (initialEntries: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <FavoriteHeroProvider>
                <QueryClientProvider client={queryClient}>
                    <HomePage />
                </QueryClientProvider>
            </FavoriteHeroProvider>
        </MemoryRouter>
    )
}



describe('HomePage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test('should render Home page with default values', () => {
        const { container } = renderHomePage();
        expect(container).toMatchSnapshot();

    })

    test('should call usePaginatedHero with default values', () => {
        renderHomePage();
        expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, 'all');
    })

    test('should call usePaginatedHero with custom query params', () => {
        renderHomePage(['/?page=2&limit=10&category=villains']);
        expect(mockUsePaginatedHero).toHaveBeenCalledWith(2, 10, 'villains');
    })

    test('should call usePaginatedHero with default page and same limit on tab favorites', () => {
        renderHomePage(['/?tab=favorites&page=2&limit=10']);
        const [,,,villainsTab] = screen.getAllByRole('tab');
        fireEvent.click(villainsTab);
        
        expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 10, 'villain');
    })

})




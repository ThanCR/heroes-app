import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { usePaginatedHero } from "./usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";

vi.mock('../actions/get-heroes-by-page.action', () => ({
    getHeroesByPageAction: vi.fn()
}))

const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
})

const tanStackCustomProvider = () => {
    return ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('usePaginatedHero.tsx', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    })

    test('should return the initial state (isLoading)', () => {
        const { result } = renderHook(() => usePaginatedHero(1, 6), {
            wrapper: tanStackCustomProvider()
        }); 

        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBeFalsy();
        expect(result.current.data).toBe(undefined);
        expect(result.current.data).toBeUndefined();

    })

    test('should return success state with data when API call succeeds', async () => {

        // mocks are done first
        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: [],
        }
        mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData);

        const { result } = renderHook(() => usePaginatedHero(1, 6), {
            wrapper: tanStackCustomProvider()
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        })

        expect(result.current.status).toBe('success');
        expect(mockGetHeroesByPageAction).toHaveBeenCalled();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, "all");

    });


        test('should call getHeroesByPageActions with argument', async () => {

        // mocks are done first
        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: [],
        }
        // this lets me return a value when mocked function gets "resolved"
        // also works for simulating rejected values
        mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData);
        

        const { result } = renderHook(() => usePaginatedHero(1, 6, 'heroes'), {
            wrapper: tanStackCustomProvider()
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        })

        expect(result.current.status).toBe('success');
        expect(mockGetHeroesByPageAction).toHaveBeenCalled();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, 'heroes');

    });
})




import { describe, expect, test } from "vitest";
import { getHeroesByPageAction } from "./get-heroes-by-page.action";

import AxiosMockAdapter from 'axios-mock-adapter';
import { heroApi } from "../api/hero.api";
import { beforeEach } from "node:test";

const BASE_URL = import.meta.env.VITE_API_URL;

describe('get-heroes-by-page.action', () => {

    // axiosmockadapter lets us to make a mock of an existing and configured api logic
    const heroesApiMock = new AxiosMockAdapter(heroApi);

    beforeEach(() => {
        heroesApiMock.reset();
    })

    test(('should return default heroes'), async () => {

        heroesApiMock.onGet('/').reply(200, {
            total: 10,
            pages: 2,
            heroes: [
                {
                    image: '1.jpg'
                }, {
                    image: '2.jpg'
                }
            ]
        });

        const response = await getHeroesByPageAction(1);

        expect(response).toStrictEqual({
            total: 10,
            pages: 2,
            heroes: [
                { image: `${BASE_URL}/images/1.jpg` },
                { image: `${BASE_URL}/images/2.jpg` }
            ]
        })
    })

    test('should return the correrct heroes when page is not a number', async () => {
        const mockData = {
            total: 10,
            pages: 1,
            heroes: [],
        }

        heroesApiMock.onGet('/').reply(200, mockData);
        heroesApiMock.resetHistory();

        await getHeroesByPageAction('asd' as unknown as number);

        const params = heroesApiMock.history.get[0].params;
        expect(params).toStrictEqual({ limit: 6, offset: 0, category: 'all' });
    })

    test('should return the correrct heroes when page is not a number', async () => {
        const mockData = {
            total: 10,
            pages: 1,
            heroes: [],
        }

        heroesApiMock.onGet('/').reply(200, mockData);
        heroesApiMock.resetHistory();

        await getHeroesByPageAction('5' as unknown as number);

        const params = heroesApiMock.history.get[0].params;
        expect(params).toStrictEqual({ limit: 6, offset: 24, category: 'all' });
    })

    
})


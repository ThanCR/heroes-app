import { describe } from "node:test"
import { expect, test } from "vitest"
import { getHero } from "./get-hero.action"


describe('get-hero.action', () => { 
    test('should fetch hero data and return with complete image url', async() => {
        const hero = await getHero('clark-kent');
        expect(hero.image).toContain('http');
    })

    test('should throw an error if hero is not found', async() => {

        const idSlug = 'clark-kent1'

        const result = await getHero(idSlug)
        .then()
        .catch((error) => {
            expect(error).toBeDefined;
            expect(error.message).toContain('Request failed ');
        });
        expect(result).toBeUndefined();
    })
 })


import { describe, expect, test } from "vitest";
import { getSummaryAction } from "./get-summary.action";


describe('get-summary.action', () => {
  test('should fetch summary and return complete information', async () => { 
    const summary = await getSummaryAction();
    expect(summary.heroCount).toBeDefined();
    expect(summary.villainCount).toBeDefined();
   })
})



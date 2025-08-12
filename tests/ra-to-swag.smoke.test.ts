import { readFileSync } from "fs";
import { join } from "path";
import { parseRaTextToSwag } from "../supabase/functions/ra-to-swag/parser";

const FIX = (f: string) => join(__dirname, "fixtures/ra", f);

test("rivera fixture parses to expected JSON", () => {
  const txt = readFileSync(FIX("rivera-ra.txt"), "utf8");
  const got = parseRaTextToSwag(txt);
  const exp = JSON.parse(readFileSync(FIX("rivera.expect.json"), "utf8"));
  expect(got).toMatchObject(exp);
});

test("patel fixture parses incl. LTC", () => {
  const txt = readFileSync(FIX("patel-ra.txt"), "utf8");
  const got = parseRaTextToSwag(txt);
  const exp = JSON.parse(readFileSync(FIX("patel.expect.json"), "utf8"));
  expect(got).toMatchObject(exp);
});

test("parser handles missing spouse correctly", () => {
  const singleText = `
    Primary Client: John Doe  Age: 65
    Spouse: — (None)
    Filing Status: Single
    Social Security
    Client Start Age: 67
    COLA: 2.0%
  `;
  
  const result = parseRaTextToSwag(singleText);
  expect(result.profile.filingStatus).toBe("single");
  expect(result.profile.spouse).toEqual({});
});

test("parser extracts 1099-heavy flag correctly", () => {
  const text = `
    Assets — Balances and Tax Type
    High Dividend Fund (1099 Heavy)     $100,000   Non-Qualified
    Standard Brokerage                  $200,000   Non-Qualified
  `;
  
  const result = parseRaTextToSwag(text);
  expect(result.assets[0].produces1099).toBe(true);
  expect(result.assets[1].produces1099).toBe(false);
});
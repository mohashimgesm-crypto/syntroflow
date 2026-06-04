import { readFileSync } from "fs";
import { n8nToMake } from "../src";

const n8nExport = JSON.parse(readFileSync("./examples/n8n-sample.json", "utf-8"));
const { blueprint, coverage, needsReview } = n8nToMake(n8nExport);

console.log(`Auto-translated ${(coverage * 100).toFixed(0)}% of nodes`);
if (needsReview.length) console.log("Needs review:", needsReview);
console.log("\nMake blueprint:\n", JSON.stringify(blueprint, null, 2));

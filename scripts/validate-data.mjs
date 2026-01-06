// Simple validator for dataset referential integrity and basic invariants.
// No external deps; run with: node scripts/validate-data.mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const readJson = async (p) => JSON.parse(await readFile(p, "utf8"));
const ok = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

async function main() {
  const root = process.cwd();
  const dataDir = path.join(root, "public", "data");

  const users = await readJson(path.join(dataDir, "users.json"));
  const providers = await readJson(path.join(dataDir, "providers.json"));
  const accounts = await readJson(path.join(dataDir, "accounts.json"));
  const funds = await readJson(path.join(dataDir, "funds.json"));
  const holdings = await readJson(path.join(dataDir, "holdings.json"));
  const contributions = await readJson(path.join(dataDir, "contributions.json"));
  const transactions = await readJson(path.join(dataDir, "transactions.json"));

  // Indexes
  const userIds = new Set(users.map((u) => u.id));
  const providerIds = new Set(providers.map((p) => p.id));
  const accountIds = new Set(accounts.map((a) => a.id));
  const fundIds = new Set(funds.map((f) => f.id));

  // Referential integrity
  for (const a of accounts) {
    ok(userIds.has(a.userId), `Account ${a.id} references missing userId ${a.userId}`);
    ok(providerIds.has(a.providerId), `Account ${a.id} references missing providerId ${a.providerId}`);
  }
  for (const h of holdings) {
    ok(accountIds.has(h.accountId), `Holding ${h.id} references missing accountId ${h.accountId}`);
    ok(fundIds.has(h.fundId), `Holding ${h.id} references missing fundId ${h.fundId}`);
    ok(h.value >= 0, `Holding ${h.id} has negative value`);
  }
  for (const c of contributions) {
    ok(accountIds.has(c.accountId), `Contribution ${c.id} references missing accountId ${c.accountId}`);
    ok(c.employeeAmount >= 0 && c.employerAmount >= 0, `Contribution ${c.id} has negative amounts`);
  }
  for (const t of transactions) {
    ok(accountIds.has(t.accountId), `Transaction ${t.id} references missing accountId ${t.accountId}`);
  }

  // Balance ~= sum(holdings.value)
  const holdingsByAccount = holdings.reduce((m, h) => {
    (m[h.accountId] ||= []).push(h);
    return m;
  }, {});
  for (const a of accounts) {
    const hv = sum((holdingsByAccount[a.id] || []).map((h) => Number(h.value)));
    const bal = Number(a.balance);
    const delta = Math.abs(hv - bal);
    ok(delta <= 0.01, `Account ${a.id} balance ${bal} != holdings sum ${hv} (delta=${delta.toFixed(2)})`);
  }

  // Basic sanity on funds expense ratios and risk levels
  const validRisk = new Set(["Very Low", "Low", "Medium", "High"]);
  for (const f of funds) {
    ok(f.expenseRatio >= 0 && f.expenseRatio < 2, `Fund ${f.id} invalid expenseRatio`);
    ok(validRisk.has(f.riskLevel), `Fund ${f.id} invalid riskLevel ${f.riskLevel}`);
  }

  // Output summary
  const summary = {
    users: users.length,
    providers: providers.length,
    accounts: accounts.length,
    funds: funds.length,
    holdings: holdings.length,
    contributions: contributions.length,
    transactions: transactions.length
  };
  console.log("[dataset:ok]", summary);
}

main().catch((e) => {
  console.error("[dataset:error]", e.message);
  process.exitCode = 1;
});
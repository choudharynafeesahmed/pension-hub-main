import { useMemo } from "react";
import { useJson } from "./useJson";

// Paths served from public/; same-origin, no auth required
const PATHS = {
  users: "/data/users.json",
  providers: "/data/providers.json",
  accounts: "/data/accounts.json",
  funds: "/data/funds.json",
  holdings: "/data/holdings.json",
  contributions: "/data/contributions.json",
  transactions: "/data/transactions.json"
};

export function usePensionData(options = {}) {
  const users = useJson(PATHS.users, options);
  const providers = useJson(PATHS.providers, options);
  const accounts = useJson(PATHS.accounts, options);
  const funds = useJson(PATHS.funds, options);
  const holdings = useJson(PATHS.holdings, options);
  const contributions = useJson(PATHS.contributions, options);
  const transactions = useJson(PATHS.transactions, options);

  const loading =
    users.loading ||
    providers.loading ||
    accounts.loading ||
    funds.loading ||
    holdings.loading ||
    contributions.loading ||
    transactions.loading;

  const error =
    users.error ||
    providers.error ||
    accounts.error ||
    funds.error ||
    holdings.error ||
    contributions.error ||
    transactions.error ||
    null;

  const data = useMemo(() => {
    if (
      !users.data ||
      !providers.data ||
      !accounts.data ||
      !funds.data ||
      !holdings.data ||
      !contributions.data ||
      !transactions.data
    ) {
      return null;
    }

    // Index helpers
    const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
    const groupBy = (arr, key) =>
      arr.reduce((m, it) => {
        const k = it[key];
        (m[k] ||= []).push(it);
        return m;
      }, {});

    const usersById = byId(users.data);
    const providersById = byId(providers.data);
    const accountsById = byId(accounts.data);
    const fundsById = byId(funds.data);

    const accountsByUser = groupBy(accounts.data, "userId");
    const holdingsByAccount = groupBy(holdings.data, "accountId");
    const contributionsByAccount = groupBy(contributions.data, "accountId");
    const transactionsByAccount = groupBy(transactions.data, "accountId");

    // Derived: account summaries aligned with balances
    const accountSummaries = accounts.data.map((a) => {
      const hs = (holdingsByAccount[a.id] || []);
      const valueSum = hs.reduce((s, h) => s + Number(h.value || 0), 0);
      const delta = Number((Number(a.balance) - valueSum).toFixed(2));
      return {
        ...a,
        provider: providersById[a.providerId]?.name || a.providerId,
        userName: usersById[a.userId]?.fullName || a.userId,
        holdingsValue: valueSum,
        balanceDelta: delta,
        holdingsCount: hs.length,
        contributionCount: (contributionsByAccount[a.id] || []).length,
        transactionCount: (transactionsByAccount[a.id] || []).length
      };
    });

    return {
      users: users.data,
      providers: providers.data,
      accounts: accounts.data,
      funds: funds.data,
      holdings: holdings.data,
      contributions: contributions.data,
      transactions: transactions.data,
      usersById,
      providersById,
      accountsById,
      fundsById,
      accountsByUser,
      holdingsByAccount,
      contributionsByAccount,
      transactionsByAccount,
      accountSummaries
    };
  }, [
    users.data,
    providers.data,
    accounts.data,
    funds.data,
    holdings.data,
    contributions.data,
    transactions.data
  ]);

  return { data, loading, error };
}
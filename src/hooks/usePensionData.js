import { useMemo } from "react";
import { useJson } from "./useJson";
import { resolveDataUrl } from "./dataConfig";

export function usePensionData(options = {}) {
  const users = useJson(resolveDataUrl("users.json"), options);
  const providers = useJson(resolveDataUrl("providers.json"), options);
  const accounts = useJson(resolveDataUrl("accounts.json"), options);
  const funds = useJson(resolveDataUrl("funds.json"), options);
  const holdings = useJson(resolveDataUrl("holdings.json"), options);
  const contributions = useJson(resolveDataUrl("contributions.json"), options);
  const transactions = useJson(resolveDataUrl("transactions.json"), options);

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

    const accountSummaries = accounts.data.map((a) => {
      const hs = holdingsByAccount[a.id] || [];
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
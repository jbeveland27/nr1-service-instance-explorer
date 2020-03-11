import { NerdGraphQuery } from "nr1";

export default async function nrdbQuery(accountId, nrql) {

  if (!nrql) {
    console.warn("You probably forgot to provide an accountId", accountId);
    throw nrql;
  }

  nrql = nrql.replace(/\n/g, " ");
  const gql = `{
    actor {
      account(id: ${accountId}) {
        nrql(query: "${nrql}") {
          results
        }
      }
    }
  }`;

  //added no_cache workaround ...
  try {
    const { data, error } = await NerdGraphQuery.query({ query: gql, fetchPolicyType: NerdGraphQuery.FETCH_POLICY_TYPE.NO_CACHE });
    if (error || !data.actor.account.nrql) {
      throw "Bad NRQL Query: " + nrql + ": " + error;
    }

    return data.actor.account.nrql.results;
  } catch (e) {
    console.warn("NRDB Query Error", nrql, e);
    throw e;
  }
}

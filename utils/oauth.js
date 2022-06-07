import qs from "query-string";

export async function completeOAuthProcess(
  code,
  endpoint,
  client_id,
  client_secret,
  next
) {
  const body = qs.stringify({
    client_id,
    client_secret,
    code,
    redirect_uri: next,
  });
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  if (response.status !== 200) {
    throw new Error(
      `Invalid status code fetching token: ${
        response.status
      } error: ${await response.text()}`
    );
  }

  const tokenInfo = await response.json();
  if (tokenInfo.error) {
    throw new Error(`OAuth issue: ${tokenInfo.error}`);
  }

  return tokenInfo;
}

import qs from "query-string";

async function getVercelToken(code, next) {
  const body = qs.stringify({
    client_id: process.env.VRCL_CLIENT_ID,
    client_secret: process.env.VRCL_CLIENT_SECRET,
    code,
    redirect_uri: next,
  });

  const response = await fetch(`https://api.vercel.com/v2/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  if (response.status !== 200) {
    throw new Error(
      `${response.status} ERROR: ${(await response.json())?.error?.message}`
    );
  }

  return await response.json();
}

export const getServerSideProps = async (context) => {
  const { next, code } = context.query;
  try {
    const result = await getVercelToken(code, next);
    return {
      props: { result, next },
    };
  } catch (error) {
    return { props: { result: { error: error.message } } };
  }
};

export default ({ result, next }) => {
  return (
    <div style={{ fontFamily: "sans-serif", margin: "auto 2em" }}>
      <h2>Result:</h2>
      <pre style={{ fontFamily: "mono", paddingBottom: "2em" }}>
        {JSON.stringify(result, null, 2)}
      </pre>
      {next && <a href={next}>Add Integration</a>}
    </div>
  );
};

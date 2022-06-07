import { completeOAuthProcess } from "../utils/oauth";

export const getServerSideProps = async (context) => {
  const { next, code } = context.query;
  let result;

  try {
    result = await completeOAuthProcess(
      code,
      `https://api.vercel.com/v2/oauth/access_token`,
      process.env.VRCL_CLIENT_ID,
      process.env.VRCL_CLIENT_SECRET,
      next
    );
  } catch (error) {
    result = { error: error.message };
  }

  return {
    props: { result, next },
  };
};

export default function Page({ result, next }) {
  return (
    <div style={{ fontFamily: "sans-serif", margin: "auto 2em" }}>
      <h2>Result:</h2>
      <pre style={{ fontFamily: "mono", paddingBottom: "2em" }}>
        {JSON.stringify(result, null, 2)}
      </pre>
      <a href={`${next}`}>Add Integration</a>
    </div>
  );
}

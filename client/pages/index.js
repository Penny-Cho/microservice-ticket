import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h2>welcome</h2> : <h2>please sign in</h2>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");
  return data;
};

export default LandingPage;

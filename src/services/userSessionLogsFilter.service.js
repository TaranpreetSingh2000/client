import client from "@/graphql/client";
import { GET_LOGINLOGS_ID } from "@/graphql/queries";

const fetchUserLoginSessionId = async (payload) => {
  try {
    const response = await client.query({
      query: GET_LOGINLOGS_ID,
      variables: payload,
      context: {
        fetchOptions: {
          cache: "no-store",
        },
      },
      fetchPolicy: "no-cache",
    });
    return response.data;
  } catch (error) {
    console.log("error", error);
    return {};
  }
};

export { fetchUserLoginSessionId };

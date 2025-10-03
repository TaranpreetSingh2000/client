import client from "@/graphql/client";
import { GET_ABCDUSER_LOGIN_ID } from "@/graphql/queries";

const fetchLoginUserId = async (payload) => {
  try {
    const response = await client.query({
      query: GET_ABCDUSER_LOGIN_ID,
      variables: { filters: payload },
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

export { fetchLoginUserId };

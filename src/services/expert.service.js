import client from "@/graphql/client";
import { GET_EXPERT_DATA } from "@/graphql/queries";

const fetchExpertData = async () => {
  try {
    const response = await client.query({
      query: GET_EXPERT_DATA,
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

export { fetchExpertData };

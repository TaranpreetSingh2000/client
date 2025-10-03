import client from "@/graphql/client";
import { GET_MODULESPAGE_DATA } from "@/graphql/queries";

const fetchUserModulePageData = async (payload) => {
  try {
    const response = await client.query({
      query: GET_MODULESPAGE_DATA,
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

export { fetchUserModulePageData };

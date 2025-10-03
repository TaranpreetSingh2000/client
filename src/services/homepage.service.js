import client from "@/graphql/client";
import { GET_HOMEPAGE_DATA } from "@/graphql/queries";

const fetchHomePageData = async () => {
  try {
    const response = await client.query({
      query: GET_HOMEPAGE_DATA,
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

export { fetchHomePageData };

import client from "@/graphql/client";
import { GET_PROFILE_HEADER_DATA } from "@/graphql/queries";

const fetchProfileHeaderData = async () => {
  try {
    const response = await client.query({
      query: GET_PROFILE_HEADER_DATA,
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

export { fetchProfileHeaderData };

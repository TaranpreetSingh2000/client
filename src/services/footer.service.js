import client from "@/graphql/client";
import { GET_FOOTER_DATA } from "@/graphql/queries";

const fetchFooterData = async () => {
  try {
    const response = await client.query({
      query: GET_FOOTER_DATA,
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

export { fetchFooterData };

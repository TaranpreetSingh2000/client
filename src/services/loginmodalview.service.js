import client from "@/graphql/client";
import { GET_LOGIN_MODAL_DATA } from "@/graphql/queries";

const fetchLoginModalData = async () => {
  try {
    const response = await client.query({
      query: GET_LOGIN_MODAL_DATA,
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

export { fetchLoginModalData };

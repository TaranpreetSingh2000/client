import client from "@/graphql/client";

const addNewsletterData = async (mutation, payload) => {
  try {
    const newsletterdata = await client.mutate({
      mutation,
      variables: payload,
    });

    return { newsletterdata };
  } catch (error) {
    console.error("Error while executing the mutation:", error);
    throw error;
  }
};

export { addNewsletterData };

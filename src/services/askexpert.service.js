import client from "@/graphql/client";

const addaskexpertData = async (mutation, payload) => {
  try {
    const askexpertdata = await client.mutate({
      mutation,
      variables: payload,
    });

    return { askexpertdata };
  } catch (error) {
    console.error("Error while executing the mutation:", error);
    throw error;
  }
};

export { addaskexpertData };

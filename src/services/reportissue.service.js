import client from "@/graphql/client";
import {
  GET_PROFILE_HEADER_DATA,
  GET_REPORT_ISSUE_DATA,
} from "@/graphql/queries";

const fetchReportIssueData = async () => {
  try {
    const response = await client.query({
      query: GET_REPORT_ISSUE_DATA,
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

export { fetchReportIssueData };

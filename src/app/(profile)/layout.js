import ProfileHeader from "@/components/Header/ProfileHeader";
import "../globals.css";
import { fetchProfileHeaderData } from "@/services/profileheader.service";
import _get from "lodash/get";
import { AuthCheck } from "@/components/AuthCheck/AuthCheck";
import ReportIssue from "@/components/ReportIssue/ReportIssue";
import { fetchReportIssueData } from "@/services/reportissue.service";
import StoreProvider from "../StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Aditya Birla capital",
  description:
    "Aditya Birla Group is an Indian conglomerate in the textile, metal, cement, finance, telecom, and many more industries. Explore our businesses, sustainability initiatives, and global impact.",
};
export default async function RootLayout({ children }) {
  const fetchedprofileheaderData = await fetchProfileHeaderData();
  const fetchedreportData = await fetchReportIssueData();

  const profileHeaderData = _get(fetchedprofileheaderData, "profileHeader", {});
  const reportIssueData = _get(fetchedreportData, "reportIssue", {});

  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          <AuthCheck>
            {profileHeaderData && (
              <ProfileHeader profileHeaderData={profileHeaderData} />
            )}
            {children}
            <ToastContainer
              position="top-right"
              autoClose={1000}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <ReportIssue reportIssueData={reportIssueData} />
            <div id="modal-root"></div>
          </AuthCheck>
        </StoreProvider>
      </body>
    </html>
  );
}

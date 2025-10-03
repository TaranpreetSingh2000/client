import "../globals.css";
import Header from "@/components/Header/Header";
import { fetchHeaderData } from "@/services/header.service";
import _get from "lodash/get";
import Footer from "@/components/Footer/Footer";
import { fetchFooterData } from "@/services/footer.service";
import StoreProvider from "../StoreProvider";
import ReportIssue from "@/components/ReportIssue/ReportIssue";
import { fetchReportIssueData } from "@/services/reportissue.service";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRemover from "@/components/UserRemover/UserRemover";

export const metadata = {
  title: "Aditya Birla capital",
  description:
    "Aditya Birla Group is an Indian conglomerate in the textile, metal, cement, finance, telecom, and many more industries. Explore our businesses, sustainability initiatives, and global impact.",
};

export default async function RootLayout({ children }) {
  const fetchedheaderData = await fetchHeaderData();
  const fetchedfooterData = await fetchFooterData();
  const fetchedreportData = await fetchReportIssueData();

  const headerData = _get(fetchedheaderData, "header", {});
  const footerData = _get(fetchedfooterData, "footer", {});
  const footerNote = _get(fetchedfooterData, "footernote", {});
  const reportIssueData = _get(fetchedreportData, "reportIssue", {});

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpeg" />
      </head>
      <body className="antialiased">
        <StoreProvider>
          <UserRemover />
          {headerData && <Header headerData={headerData} />}
          {children}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <ReportIssue reportIssueData={reportIssueData} />

          <Footer
            footerData={footerData ?? footerData}
            footerNote={footerNote ?? footerNote}
          />

          <div id="modal-root"></div>
        </StoreProvider>
      </body>
    </html>
  );
}

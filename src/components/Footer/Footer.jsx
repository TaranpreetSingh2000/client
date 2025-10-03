import FooterDisclaimer from "./FooterDisclaimer";
import FooterNote from "./FooterNote";

const Footer = ({ footerData, footerNote }) => {
  return (
    <footer>
      {footerData && <FooterDisclaimer footerDisclaimerData={footerData} />}
      {footerNote && <FooterNote footerNoteData={footerNote} />}
    </footer>
  );
};

export default Footer;

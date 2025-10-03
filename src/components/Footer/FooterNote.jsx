import _map from "lodash/map";
import Link from "next/link";

const FooterNote = ({ footerNoteData }) => {
  const { copyRightText, socialMedia } = footerNoteData;
  return (
    <section className="bg-primary-400">
      <div className="py-3 md:py-6 px-4 max-w-[var(--breakpoint-large)] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <p className="text-gray-200 font-semibold max-md:text-sm md:text-md text-center md:text-start tracking-tight">
            {copyRightText}
          </p>
          <ul className="hidden md:flex gap-3 items-center">
            {_map(socialMedia, (item, index) => (
              <li key={index} className="w-5 h-5 flex items-center">
                <Link
                  href={item?.socialMediaUrl ? item?.socialMediaUrl : "#"}
                  target="_blank"
                  className="h-full w-full"
                >
                  <img
                    src={item?.socialIcon?.url}
                    alt={item?.socialIcon?.alternativeText || "logo"}
                    className="w-full h-full"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FooterNote;

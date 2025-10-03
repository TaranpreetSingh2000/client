import _map from "lodash/map";
import _get from "lodash/get";

const FinancialLiteracy = ({ userModulesPageData }) => {
  const financialLiteracySection = _get(
    userModulesPageData,
    "financialLiteracyModulesSection",
    {},
  );

  return (
    <>
      <div className="rounded-[20px] px-9 pt-7.5 pb-5 bgimg text-white">
        <div className="flex lg:flex-row flex-col-reverse justify-between">
          <div>
            <div className="font-extralight text-[36px] lg:text-[52px] leading-9 lg:leading-[44px] text-left align-middle mb-5">
              <h1>{financialLiteracySection?.title}</h1>
            </div>
            <div className="flex flex-wrap mt-4 lg:gap-2.5 gap-1">
              {_map(financialLiteracySection?.stats, (item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-[#0000001A] px-1.5 rounded-[8px] py-1"
                  >
                    <div className="flex items-center gap-[3px]">
                      <div className="w-4.5 h-4.5">
                        <img
                          className="w-full h-full"
                          src={item?.icon?.url}
                          alt={item?.icon?.alternativeText}
                        />
                      </div>
                      <div className="text-sm leading-[14px] font-normal">
                        <p>{item.title}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="max-w-[342px] max-h-[160px] flex-shrink-0">
            <img
              src={financialLiteracySection?.media?.url}
              alt={financialLiteracySection?.media?.alternativeText || "image"}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default FinancialLiteracy;

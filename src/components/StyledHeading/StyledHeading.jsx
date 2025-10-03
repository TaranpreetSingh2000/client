import _map from "lodash/map";

const StyledHeading = ({ styledHeadingData, extraClasses }) => {
  return (
    <>
      <h2
        className={[
          "text-mainheading",
          "font-extralight",
          "text-center ",
          extraClasses,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {_map(styledHeadingData, (item, index) => {
          return (
            <span
              key={index}
              className={[
                item?.color === "Red" && "text-primary-100",
                item?.breakLine && "breakline",
                "font-extralight",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item?.heading}{" "}
            </span>
          );
        })}
      </h2>
    </>
  );
};

export default StyledHeading;

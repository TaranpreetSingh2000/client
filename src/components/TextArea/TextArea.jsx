import _map from "lodash/map";
const TextArea = ({ textAreaData, extraClasses }) => {
  const textarea = textAreaData?.split("\n").filter(Boolean);

  return (
    <>
      {_map(textarea, (item, index) => {
        const classProps = extraClasses ? { className: extraClasses } : {};

        return (
          <p key={index} {...classProps}>
            {item}
          </p>
        );
      })}
    </>
  );
};

export default TextArea;

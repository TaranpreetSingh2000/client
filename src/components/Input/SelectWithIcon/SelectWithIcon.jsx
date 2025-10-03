const SelectWithIcon = ({
  id,
  iconSrc,
  name,
  value,
  onChange,
  options = [],
}) => (
  <div className="relative w-full">
    <label htmlFor={id} className="sr-only">
      {id}
    </label>
    <img
      src={iconSrc}
      alt={`${name} icon`}
      className="w-3 h-3 absolute left-4 top-1/2 transform -translate-y-1/2"
      aria-hidden="true"
    />
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full appearance-none text-wrap bg-gray-100 text-xs font-normal text-black border border-gray-200 rounded-md py-3 pl-10 pr-12 focus:outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <svg
      className="w-3 h-3 text-gray-500 absolute right-8 md:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

export default SelectWithIcon;

const InputWithIcon = ({
  id,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  iconSrc,
  disabled = false,
  onBlur,
}) => (
  <div className="relative w-full">
    <img
      src={iconSrc}
      alt={`${name} icon`}
      className="w-3 h-3 absolute left-4 top-1/2 transform -translate-y-1/2"
      aria-hidden="true"
    />
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      name={name}
      onBlur={onBlur}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-gray-100 placeholder-black font-normal text-black text-xs border border-gray-200
       rounded-lg py-3 pl-10 pr-4"
    />
  </div>
);

export default InputWithIcon;

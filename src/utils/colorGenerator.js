import { GLOBAL_COLOR_CODES } from "@/constants/constant";
import _map from "lodash/map";

const colorGenerator = (data, colorCodes) => {
  const colors = Object.values(colorCodes || GLOBAL_COLOR_CODES); // Get the array of color values

  const updatedData = _map(data, (item, index) => {
    // Assign color using modulo to handle cases where data.length > colors.length
    const color = colors[index % colors.length];

    return {
      ...item,
      color: color,
    };
  });

  return updatedData;
};

export default colorGenerator;

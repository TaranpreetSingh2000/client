import _map from "lodash/map";

const bannerKeyframeGenertor = (data) => {
  const fontSizes = ["28px", "32px", "42px", "52px", "62px", "78px"];
  const offsets = {
    "28px": 34,
    "32px": 38,
    "42px": 50,
    "52px": 62,
    "62px": 74,
    "78px": 94,
  };

  const items = data;

  const duration = items?.length * 2.4;
  const totalDuration = duration + 2.4;
  const itemDurationPercent =
    ((duration / totalDuration) * 100) / items?.length;
  const move = 70 / totalDuration;

  const allKeyframes = {};

  fontSizes.forEach((fontSize) => {
    const offset = offsets[fontSize];

    const keyframes = `
    .animate-sequence { position: relative; }
    .item-0 { position: absolute; top: 0px; }
    ${_map(
      items.slice(1),
      (_, i) => `.item-${i + 1} { position: absolute; top: ${offset}px; }`,
    ).join("")}
    ${_map(
      items,
      (_, i) =>
        `.animate-sequence .item-${i} { animation: item${i} ${
          totalDuration
        }s infinite linear; }`,
    ).join("")}
    ${_map(items, (_, i) => {
      let keyframe = `@keyframes item${i} {`;
      const p = itemDurationPercent;
      const n = items?.length;
      const t = 1200 / n / (totalDuration * 10);
      if (i === 0) {
        keyframe += `
          0%,${p}% { top: 0px; }
          ${p + move}% { top: -${offset}px; }
          ${p * n + (n - i - 1) * t}% { top: -${offset}px; }
          ${
            p * n +
            (n - i - 1) * t +
            (p * n + (n - i) * t - (p * n + (n - i - 1) * t)) / 2
          }%,100% { top: 0px; }
        `;
      } else if (i === n - 1) {
        keyframe += `
          0%,${p * i}% { top: ${offset}px; }
          ${p * i + move}% { top: 0px; }
          ${p * (i + 1)}% { top: 0px; }
          ${p * n + (n - i) * t}%,100% { top: ${offset}px; }
        `;
      } else {
        keyframe += `
          0%,${p * i}% { top: ${offset}px; }
          ${p * i + move}% { top: 0px; }
          ${p * (i + 1)}% { top: 0px; }
          ${p * (i + 1) + move}% { top: -${offset}px; }
          ${p * n + (n - i - 1) * t}% { top: -${offset}px; }
          ${p * n + (n - i) * t}%,100% { top: ${offset}px; }
        `;
      }
      return keyframe + `}`;
    }).join("")}
  `;

    allKeyframes[fontSize] = keyframes;
  });

  return allKeyframes;
};
export default bannerKeyframeGenertor;

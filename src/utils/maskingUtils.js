function maskPhoneNumber(phoneNumber) {
  if (typeof phoneNumber !== "string" || phoneNumber?.length <= 4)
    return phoneNumber ?? "";

  const firstTwo = phoneNumber.slice(0, 2);
  const lastTwo = phoneNumber.slice(-2);
  const maskedMiddle = "*".repeat(phoneNumber.length - 4);

  return firstTwo + maskedMiddle + lastTwo;
}

function maskEmail(email) {
  if (typeof email !== "string" || !email.includes("@")) return email ?? "";

  const [localPart, domain] = email.split("@");
  if (localPart.length <= 3) {
    return `${localPart}@${domain}`;
  }

  const visiblePart = localPart.slice(0, 3);
  const maskedPart = "*".repeat(localPart.length - 3);

  return `${visiblePart}${maskedPart}@${domain}`;
}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const companyAuthorizationvalidationChecker = (email, domainList) => {
  const emailDomain = email.split("@")[1].split(".")[0];
  const matchedCompany =
    domainList &&
    domainList.find((item) => {
      const domainPart = item?.value.split(".")[0];
      return domainPart.toLowerCase() === emailDomain.toLowerCase();
    });

  return matchedCompany;
};

const isEmailValidChecker = (email) =>
  /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)?@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(email);

const isPhoneValidChecker = (num) => /^[6-9]\d{9}$/.test(num);

const isYoutubeRegexChecker = (url) =>
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[\w-]{11}|youtu\.be\/[\w-]{11})([&?#][^\s]*)?$/.test(
    url,
  );

const getYouTubeEmbedUrl = (url) => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.split("/")[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    return url;
  } catch {
    return url;
  }
};

export {
  maskEmail,
  maskPhoneNumber,
  formatTime,
  companyAuthorizationvalidationChecker,
  isEmailValidChecker,
  isPhoneValidChecker,
  getYouTubeEmbedUrl,
  isYoutubeRegexChecker,
};

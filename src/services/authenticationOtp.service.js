import { httpService } from "@/lib/httpService";
import { decryptData } from "@/utils/decryption";
import { encryptData } from "@/utils/encryption";

export const generateUserToken = async (employeeType, bearerToken) => {
  const params = {
    client_id: process.env.NEXT_PUBLIC_ABCD_CLIENT_ID,
    scope: process.env.NEXT_PUBLIC_ABCD_SCOPE,
    grant_type: process.env.NEXT_PUBLIC_ABCD_GRANT_TYPE,
  };

  const payloadCV = encryptData(params);
  const IVtype = encryptData(employeeType);
  const combinedPayload = {
    payloadCV,
    IVtype,
  };
  return httpService.post("/api/client/generate-user-token", combinedPayload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
  });
};

export const fetchUserDataId = async (
  email,
  numValue,
  employeeType,
  bearerToken,
  setTrackResponse,
) => {
  const filterDataPayload =
    employeeType === "ABG Employee"
      ? { email: { eq: email } }
      : { mobile: { eq: numValue } };

  const payload = encryptData(filterDataPayload);

  try {
    const response = await httpService.post(
      "/api/client/profile/exist",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );

    const decryptedResponse = decryptData(
      response?.data?.response?.abcdUserLoginsPrivateSession,
    );
    const userData = Array.isArray(decryptedResponse)
      ? decryptedResponse[0]
      : decryptedResponse;

    // const userData = response?.data?.response?.abcdUserLogins?.[0];
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    if (setTrackResponse) setTrackResponse(false);
    return false;
  }
};

export const fetchUserDataActive = async (
  email,
  numValue,
  employeeType,
  bearerToken,
) => {
  const filterDataPayload =
    employeeType === "ABG Employee"
      ? { email: { eq: email } }
      : { mobile: { eq: numValue } };

  const payload = encryptData(filterDataPayload);

  try {
    const response = await httpService.post(
      "/api/client/profile/active",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );

    const decryptedResponse = decryptData(
      response?.data?.response?.abcdUserLoginsPrivateSession,
    );
    const userData = Array.isArray(decryptedResponse)
      ? decryptedResponse[0]
      : decryptedResponse;
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return false;
  }
};

export const generateOTPService = async (
  email,
  numValue,
  userToken,
  employeeType,
  bearerToken,
) => {
  const payload =
    employeeType === "ABG Employee"
      ? { emailID: email }
      : { mobileNo: numValue };

  const otpBody = payload?.mobileNo
    ? {
        Source: process.env.NEXT_PUBLIC_ABCD_OTP_SOURCE,
        Functionality: process.env.NEXT_PUBLIC_ABCD_OTP_MOBILE_FUNCTIONALITY,
        MobileNo: payload?.mobileNo,
      }
    : {
        Source: process.env.NEXT_PUBLIC_ABCD_OTP_SOURCE,
        Functionality: process.env.NEXT_PUBLIC_ABCD_OTP_EMAIL_FUNCTIONALITY,
        EmailId: payload?.emailID,
      };

  const payloadIV = encryptData(otpBody);
  const payloadCV = encryptData(userToken);

  const combinedPayload = {
    payloadIV,
    payloadCV,
  };

  return httpService.post("/api/client/generate-otp", combinedPayload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
  });
};

export const validateOTPService = async (
  email,
  numValue,
  allValues,
  userToken,
  bearerToken,
) => {
  const payload = email
    ? { email, OTP: Number(allValues.join("")) }
    : { mobileNo: numValue, OTP: Number(allValues.join("")) };

  const otpBody = payload?.mobileNo
    ? {
        Source: process.env.NEXT_PUBLIC_ABCD_OTP_SOURCE,
        Functionality: process.env.NEXT_PUBLIC_ABCD_OTP_MOBILE_FUNCTIONALITY,
        MobileNo: payload?.mobileNo,
        OTP: payload?.OTP,
      }
    : {
        Source: process.env.NEXT_PUBLIC_ABCD_OTP_SOURCE,
        Functionality: process.env.NEXT_PUBLIC_ABCD_OTP_EMAIL_FUNCTIONALITY,
        EmailId: payload?.email,
        OTP: payload?.OTP,
      };

  const payloadCV = encryptData(userToken);
  const payloadSource = encryptData(otpBody);

  const combinedEncryptedPayload = {
    payloadCV,
    payloadSource,
  };

  return httpService.post(
    "/api/client/validate-otp",
    combinedEncryptedPayload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    },
  );
};

export const updateProfileService = async (bearerToken, payload) => {
  let bodyData;

  const { formData, userId, imageData } = payload;

  if (formData) {
    bodyData = {
      data: {
        name: formData.name,
        DOB: formData.DOB,
        gender: formData.gender,
        mobile: formData.mobile,
        email: formData.email.toLowerCase(),
        companyName: formData.companyName,
        workLocation: formData.workLocation,
      },
    };
  }

  if (imageData) {
    bodyData = imageData;
  }

  const payloadIV = encryptData(bodyData);
  const payloadCV = encryptData(userId);

  const combinedEncryptedPayload = {
    payloadIV,
    payloadCV,
  };
  return await httpService.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/client/profile/update-user-profile`,
    combinedEncryptedPayload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    },
  );
};

export const uploadProfileImageService = async (bearerToken, data) => {
  try {
    return await httpService.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/client/profile/upload-image`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );
  } catch (err) {
    return err;
  }
};

export const deleteProfileImageService = async (bearerToken, id) => {
  const payload = {
    documentId: id,
  };
  return await httpService.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/client/profile/remove-profile-image`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    },
  );
};

export const updateLoginTimestamp = async (bearerToken, userId) => {
  const payloadIV = encryptData(userId);
  return await httpService.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/client/profile/update-timestamp`,
    { payloadIV },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    },
  );
};

export const fetchUserLatestSession = async (documentID, bearerToken) => {
  const filters = {
    sessionId: {
      eq: documentID,
    },
  };

  const payload = { filters };

  const payloadIV = encryptData(payload);
  try {
    const response = await httpService.post(
      "/api/client/profile/update-session",
      payloadIV,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );

    const userLoginSessionData = response;
    return userLoginSessionData;
  } catch (error) {
    console.error("Error fetching user session data:", error);
    return false;
  }
};

import { ErrorJSONResponse } from "@ncsuguessr/types";

export const getImageExtension = (mimetype: string): string | null => {
  switch (mimetype) {
    case "image/jpeg":
      return ".jpg";
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/heic":
      return ".heic";
    case "image/heif":
      return ".heif";
    default:
      return null;
  }
};

export const generateHttpExceptionMessage = (error: string): string => {
  return JSON.stringify({ success: false, error } satisfies ErrorJSONResponse);
};

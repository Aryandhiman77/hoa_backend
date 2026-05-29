import fs from "fs/promises";
import path from "path";
import { cwd } from "process";

/**
 * Deletes files safely from the server only inside /public/uploads/
 * Returns indexes of files that could not be deleted.
 * @param {string[]} fileUrls - relative URLs like "/uploads/story-abc.jpg"
 */
export const unlinkFilesFromServerUsingPath = async (fileUrls = []) => {
  if (!Array.isArray(fileUrls) || !fileUrls.length) return [];

  const failedIndexes = [];
  const uploadsDir = path.join(cwd(), "public", "uploads"); // enforce uploads folder

  await Promise.all(
    fileUrls.map(async (fileUrl, index) => {
      try {
        // Remove leading slash
        let relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;

        // Construct absolute path
        const filePath = path.resolve(cwd(), "public", relativePath);

        // Security check: filePath must start with uploadsDir
        if (!filePath.startsWith(uploadsDir)) {
          failedIndexes.push(index);
          return;
        }

        await fs.unlink(filePath);
      } catch (error) {
        failedIndexes.push(index);
      }
    }),
  );

  return failedIndexes;
};

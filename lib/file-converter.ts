export function filetobase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        // Strip the prefix "data:<mime-type>;base64,"
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("File reading failed."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file."));
    };

    reader.readAsDataURL(file);
  });
}

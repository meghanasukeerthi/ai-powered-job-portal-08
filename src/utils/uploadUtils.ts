export const validateFile = (file: File): void => {
  if (file.type !== 'application/pdf') {
    throw new Error("Please upload a PDF file");
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error("File size must be less than 5MB");
  }
};

export const handleUploadProgress = (
  setProgress: (value: number) => void
): NodeJS.Timeout => {
  return setInterval(() => {
    setProgress((prev) => Math.min(prev + 10, 90));
  }, 200) as NodeJS.Timeout;
};
export async function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Event listener for when the file has been read
    reader.onload = () => {
      // The result attribute contains the data as a URL representing the file's data as a base64 encoded string.
      // It will look like: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
      // If you only want the Base64 part, you need to split the string.
      if (typeof reader.result === 'string') {
        resolve(reader.result); // Returns the full data URL
        // Or, if you only want the Base64 part:
        // const base64String = reader.result.split(',')[1];
        // resolve(base64String);
      } else {
        reject(new Error("Failed to read file as string."));
      }
    };

    // Event listener for errors
    reader.onerror = (error) => {
      reject(error);
    };

    // Event listener for when the read operation is aborted
    reader.onabort = () => {
      reject(new Error("File read was aborted."));
    };

    // Read the file as a Data URL (which includes the Base64 string)
    reader.readAsDataURL(file);
  });
}

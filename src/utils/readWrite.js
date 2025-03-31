import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { CITIES } from "../components/constants.js";
import i18next from "i18next";

console.log("AWS Region:", "VITE_AWS_REGION");
console.log("AWS Access Key ID:", "VITE_AWS_ACCESS_KEY_ID");
console.log("AWS S3 Bucket ID:", "VITE_AWS_S3_BUCKET_ID");
console.log("AWS Region:", "VITE_AWS_REGION");
console.log("AWS Secret Access Key:", "VITE_AWS_SECRET_ACCESS_KEY");

const awsRegion = "us-east-2";
const awsAccessKeyId = "VITE_AWS_ACCESS_KEY_ID";
const awsSecretAccessKey = "VITE_AWS_SECRET_ACCESS_KEY";
const awsS3BucketId = "VITE_AWS_S3_BUCKET_ID";

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});
const bucketName = "VITE_AWS_S3_BUCKET_ID";
console.log("Bucket Name:", bucketName);

const streamToString = async (stream) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = "";
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      result += decoder.decode(value, { stream: !done });
    }
  }

  return result;
};

function getFileName(cityName, type) {
  const fileName = CITIES.find((city) => city.value === cityName).locode;
  const language = i18next.language || "en"; // Default to 'en' if no language is set
  return `data/${language}/${type}/${fileName}.json`;
}

export const readFile = async (cityName, type) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: getFileName(cityName, type),
    });
    const response = await s3Client.send(command);
    const data = await streamToString(response.Body);
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file from S3:", err);
    throw err;
  }
};

export const writeFile = async (cityName, data, type) => {
  try {
    const dataJson = JSON.stringify(data, null, 2);
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: getFileName(cityName, type),
      Body: dataJson,
      ContentType: "application/json",
    });
    await s3Client.send(command);
    console.log("New ranking saved to S3");
  } catch (err) {
    console.error("Error writing file to S3:", err);
    throw err;
  }
};

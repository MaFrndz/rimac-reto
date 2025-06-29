import { APIGatewayProxyHandler } from "aws-lambda";
import * as fs from "fs";
import * as path from "path";

export const swaggerHandler: APIGatewayProxyHandler = async () => {
  const filePath = path.join(__dirname, "../../openapi.yaml");
  const openapi = fs.readFileSync(filePath, "utf8");
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/yaml" },
    body: openapi,
  };
};

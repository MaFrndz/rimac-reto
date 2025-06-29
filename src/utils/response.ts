// Stub para createResponse
export function createResponse(statusCode: number, body: any) {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}

import { createServerFn } from "@tanstack/react-start";

export type SurveyPayload = {
  spreadsheetTitle: string;
  sheetTitle: string;
  headers: string[];
  rows: string[][];
  fetchedAt: string;
};

export const getSurveyData = createServerFn({ method: "GET" }).handler(
  async (): Promise<SurveyPayload> => {
    const { fetchSheet } = await import("./sheets.server");
    return await fetchSheet();
  }
);

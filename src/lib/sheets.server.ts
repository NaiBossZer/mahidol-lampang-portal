export async function fetchSheet() {
  const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;

  if (!sheetUrl) {
    throw new Error("GOOGLE_SHEET_CSV_URL is missing in environment variables");
  }

  const response = await fetch(sheetUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch Google Sheets CSV");
  }

  const csvText = await response.text();
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return {
      spreadsheetTitle: "แบบสอบถามความพึงพอใจ",
      sheetTitle: "Form Responses 1",
      headers: [] as string[],
      rows: [] as string[][],
      fetchedAt: new Date().toISOString(),
    };
  }

  const parseRow = (text: string): string[] => {
    return text
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((cell) => cell.replace(/^"|"$/g, "").trim());
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(parseRow);

  return {
    spreadsheetTitle: "แบบสอบถามความพึงพอใจ",
    sheetTitle: "Form Responses 1",
    headers,
    rows,
    fetchedAt: new Date().toISOString(),
  };
}

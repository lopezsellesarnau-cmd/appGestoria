/**
 * Generates a CSV string from an array of objects.
 * @param {string[]} headers - Column headers
 * @param {string[]} columns - Keys to extract from each row object
 * @param {Record<string, unknown>[]} rows - Data rows
 * @returns {string} CSV-formatted string with BOM for Excel compatibility
 */
// ponytail: manual RFC-4180 CSV. Upgrade to Papa Parse if edge cases multiply.
export function generateCSV(headers, columns, rows) {
	const escape = (value) => {
		const str = String(value ?? "");
		if (str.includes(",") || str.includes('"') || str.includes("\n")) {
			return `"${str.replace(/"/g, '""')}"`;
		}
		return str;
	};

	const headerLine = headers.map(escape).join(",");
	const dataLines = rows.map((row) =>
		columns.map((col) => escape(row[col])).join(",")
	);

	// BOM for Excel UTF-8 compatibility
	return "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
}

/**
 * Triggers a browser download of a CSV file.
 * @param {string} csvContent - The CSV string to download
 * @param {string} filename - Download filename (without .csv)
 */
export function downloadCSV(csvContent, filename) {
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", `${filename}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

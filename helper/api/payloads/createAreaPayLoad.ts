import { v4 as uuidv4 } from "uuid";

export function createAreaRequest(customTitle: string | null = null, customDescription = "") {
  const title = customTitle || "title_" + uuidv4();
  const description = customDescription || "";

  return {
    imageUrl: "https://cdn2.percipio.com/public/c/public/images/customArea.jpg",
    localizedMetadataList: [
      { description, languageId: 1.0, title },
      { description, languageId: 2.0, title: title + "2" },
      { description, languageId: 3.0, title: title + "3" },
      { description, languageId: 4.0, title: title + "4" },
    ],
    subjectType: "standard",
    title,
    skillActivityDashboard: true,
  };
}


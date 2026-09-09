import { v4 as uuidv4 } from "uuid";

export function createAttributeRequest(role?: string) {
  return {
    name: "Attribute-" + uuidv4(),
    allowImpromptuValueCreation: true,
    typeName: "VALUE",
    optionValues: ["Chrome", "ie"],
    displayLabel: [
      { text: "English Test Attribute", locale: "en-US" },
      { text: "French Test Attribute", locale: "fr-FR" },
      { text: "Portuguese Test Attribute", locale: "pt-BR" },
    ],
  };
}


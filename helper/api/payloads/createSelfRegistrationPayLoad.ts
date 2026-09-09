import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

export function createSelfRegistrationRequest(organizationUuid: string) {
  return {
    organizationUuid,
    email: faker.internet.email().toString(),
    firstName: faker.person.firstName().toString(),
    lastName: faker.person.lastName().toString(),
    externalUserId: "",
    formSubmission: 3200,
    externalId: uuidv4(),
  };
}


import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

type UserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  role_uuid: string;
  status: "ACTIVE";
  scheduledEmail: { sendEmail: boolean };
  password: string;
  customAttributes?: Array<{ value: string; custom_attribute_id: string | null }>;
  loginName: string;
  externalId?: string;
  external_id?: string;
};

export function createUserRequest(
  role: string,
  attribute_uuid: string | null,
  password: string,
  includeCustomAttributes = true,
  isProvisioningRequest = false,
  isSiteAdmin = true
): UserPayload {
  const user: UserPayload = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    role_uuid: role,
    status: "ACTIVE",
    scheduledEmail: { sendEmail: true },
    password,
    loginName: isSiteAdmin ? "adminsw" : uuidv4(),
  };

  if (includeCustomAttributes) {
    user.customAttributes = [
      {
        value: "chrome",
        custom_attribute_id: attribute_uuid,
      },
    ];
  }

  if (isProvisioningRequest) {
    user.externalId = uuidv4();
  } else {
    user.external_id = uuidv4();
  }
  return user;
}


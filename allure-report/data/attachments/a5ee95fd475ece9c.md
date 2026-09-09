# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> Insert — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:44:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
  1   | import type { APIRequestContext } from "@playwright/test";
  2   | import { expect } from "@playwright/test";
  3   | import path from "path";
  4   | import fs from "fs";
  5   | 
  6   | import { urlData } from "./urls";
  7   | import { tokenGeneratorApipayload } from "./payloads/tokenGeneratorPayload";
  8   | // eslint-disable-next-line @typescript-eslint/no-var-requires
  9   | 
  10  | import { headerData } from "./headers/headers";
  11  | import { logger } from "../../utils/logger";
  12  | 
  13  | export class APIClient {
  14  |   async generateToken(
  15  |     request: APIRequestContext,
  16  |     serviceConfig: {
  17  |       url: string;
  18  |       username: string;
  19  |       password: string;
  20  |       orgId: string;
  21  |       [k: string]: any;
  22  |     },
  23  |     retryCount = 0,
  24  |   ): Promise<string | undefined> {
  25  |     try {
  26  |       const res = await request.post(urlData.authenticateUrl(serviceConfig), {
  27  |         data: tokenGeneratorApipayload(
  28  |           serviceConfig.username as string,
  29  |           serviceConfig.password as string,
  30  |           serviceConfig.orgId,
  31  |         ),
  32  |         headers: { "Content-Type": "application/json" },
  33  |       });
  34  |       expect(res.status()).toBe(200);
  35  |       const token = await res.json();
  36  |       const jwtToken: string = token["id_token"];
  37  |       logger.info(
  38  |         `Admin Token has been generated in attempt ${retryCount + 1}`,
  39  |       );
  40  |       return jwtToken;
  41  |     } catch (error) {
  42  |       if (retryCount < 10) {
  43  |         logger.error(
  44  |           `Unable to generate admin token. Retrying... (Retry ${retryCount + 1} of 10)`,
  45  |         );
  46  |         logger.error(error);
  47  |         return this.generateToken(request, serviceConfig, retryCount + 1);
  48  |       } else {
  49  |         const errorMessage = `Retry limit exceeded (10 attempts). Unable to generate admin token. Error: ${error}`;
  50  |         logger.error(errorMessage);
  51  |       }
  52  |     }
  53  |   }
  54  | 
  55  |   static getEnvVariables(): Record<string, any> {
  56  |     const envName = process.env.NODE_ENV || "develop";
  57  |     const configPath = path.join(__dirname, "../../config", `${envName}.json`);
  58  |     if (!fs.existsSync(configPath)) {
  59  |       throw new Error(
  60  |         `Config not found: ${configPath}. Set NODE_ENV (e.g. develop) or create the file.`,
  61  |       );
  62  |     }
  63  |     const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  64  |     return config;
  65  |   }
  66  | 
  67  |   async getDomainByOrgId(
  68  |     request: APIRequestContext,
  69  |     organizationUuid: string,
  70  |     serviceConfig: { url: string; [k: string]: any },
  71  |   ): Promise<string> {
  72  |     const response = await request.get(
  73  |       urlData.getOrgDetailsUrl(organizationUuid, serviceConfig),
  74  |       {
  75  |         headers: headerData.basicAuth(
  76  |           serviceConfig as unknown as { token: string },
  77  |         ),
  78  |       },
  79  |     );
  80  |     expect(response.status()).toBe(200);
  81  |     expect(response.ok()).toBeTruthy();
  82  |     const orgDetails = await response.json();
  83  |     return orgDetails.domain as string;
  84  |   }
  85  | 
  86  |   async getOrgDetailsByDomain(
  87  |     request: APIRequestContext,
  88  |     domain: string,
  89  |     serviceConfig: { url: string; [k: string]: any },
  90  |   ): Promise<string> {
  91  |     const url = urlData.getOrgDetailsUrl(domain, serviceConfig);
  92  |     const response = await request.get(url, {
  93  |       headers: headerData.basicAuth(
  94  |         serviceConfig as unknown as { token: string },
  95  |       ),
  96  |     });
> 97  |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  98  |     expect(response.ok()).toBeTruthy();
  99  |     const orgDetails = await response.json();
  100 |     return orgDetails.id as string;
  101 |   }
  102 | }
  103 | 
```
import "server-only";

import { z } from "zod";

/** Treat blank values from a copied .env.example as unset values. */
const blankToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

/** Validate an optional value only when a feature starts using it. */
const optionalString = z.preprocess(
  blankToUndefined,
  z.string().min(1).optional(),
);

/** Validate an optional URL such as the database or auth server URL. */
const optionalUrl = z.preprocess(blankToUndefined, z.url().optional());

/** Require strong auth secrets once a value is configured. */
const optionalSecret = z.preprocess(
  blankToUndefined,
  z.string().min(32).optional(),
);

const serverEnvSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    TMDB_READ_ACCESS_TOKEN: optionalString,
    DATABASE_URL: optionalUrl,
    BETTER_AUTH_SECRET: optionalSecret,
    BETTER_AUTH_URL: optionalUrl,
    GOOGLE_CLIENT_ID: optionalString,
    GOOGLE_CLIENT_SECRET: optionalString,
  })
  .superRefine((values, context) => {
    const hasGoogleClientId = !!values.GOOGLE_CLIENT_ID;
    const hasGoogleClientSecret = !!values.GOOGLE_CLIENT_SECRET;

    if (hasGoogleClientId !== hasGoogleClientSecret) {
      context.addIssue({
        code: "custom",
        path: ["GOOGLE_CLIENT_ID"],
        message: "Set both Google OAuth credentials or leave both empty.",
      });
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

const parsedEnv = serverEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => {
      const path = issue.path.join(".") || "environment";
      return `${path}: ${issue.message}`;
    })
    .join("\n");

  throw new Error(`Invalid server environment variables:\n${issues}`);
}

/** Validated server-only settings. Unused future settings may stay unset. */
export const env = parsedEnv.data;

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as http from "../http.js";
import type * as propertyExpenses from "../propertyExpenses.js";
import type * as router from "../router.js";
import type * as transactions from "../transactions.js";

import type * as createAdmin from "../createAdmin.js";
import type * as expenses from "../expenses.js";
import type * as migration from "../migration.js";
import type * as passwords from "../passwords.js";
import type * as sessions from "../sessions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  categories: typeof categories;
  http: typeof http;
  propertyExpenses: typeof propertyExpenses;
  router: typeof router;
  transactions: typeof transactions;

  createAdmin: typeof createAdmin;
  expenses: typeof expenses;
  migration: typeof migration;
  passwords: typeof passwords;
  sessions: typeof sessions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

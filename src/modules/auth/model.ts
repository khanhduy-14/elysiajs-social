import { t } from "elysia";
import { table } from "../../db/table";
import { refine, spread } from "../../utils/database";
import { createId } from "@paralleldrive/cuid2";

const user = refine(spread(table.user, "select"), {
  password: t.String({
    minLength: 1,
    error: "Password cannot be empty",
  }),
  name: t.String({
    minLength: 1,
    error: "Name cannot be empty",
  }),
  email: t.String({
    format: "email",
    maxLength: 255,
    error: "Valid email address is required",
  }),
  avatarUrl: t.Nullable(
    t.String({
      format: "uri",
      maxLength: 512,
    }),
  ),
});

user.publicId.examples = [createId()];
user.password.examples = [
  "Ic4p/AKwv7RcAcGFCUVXtUvY2Kc8ynINea7i+CtJyDKR+aTsQ/ByLpcVX9arQQXmvMgDYmx0GT7yXYw0cY3YBCmMSuFj4gsc2UZLwOshZHXVG1CmG7SnbrMSqwOjNobbgmOsu+GkukBx8t8CRdQfwsnZUlI16o/XO8vrdfzxAsxgIFNFTT4eXULLUdiG5KxbFHr3DtAtvDoymfCl44tGn1SNXrargKE2RfCWvdXCvZ9M0EgooVTvlTp4DWABvg4BawiPiy19nQUWV/NTGKOqAeYFHRDDxOkkGr1DOuW1glBQ4dA3uBWagZhTpB4avtN3k2Px6RpTi1REm7FtF9COqA==",
];
user.name.examples = ["kd14"];
user.email.examples = ["kd14@yopmail.com"];
user.createdAt.examples = [1765357644270];
user.avatarUrl.examples = ["https://picsum.photos/200/300", ""];
user.updatedAt.examples = [1765357644270];

export namespace AuthModel {
  export const signUpBody = t.Object({
    password: user.password,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  });

  export type signUpBody = typeof signUpBody.static;

  export const signUpResponse = t.Object({
    id: user.publicId,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });

  export type signUpResponse = typeof signUpResponse.static;

  // Sign in models
  export const signInBody = t.Object({
    email: user.email,
    password: user.password,
  });

  export type signInBody = typeof signInBody.static;

  export const signInResponse = t.Object({
    id: user.publicId,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });

  export type signInResponse = typeof signInResponse.static;
}

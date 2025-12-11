import { t } from "elysia";
import { table } from "../../db/table";
import { spread } from "../../utils/database";
import { createId } from "@paralleldrive/cuid2";

const user = spread(table.user, "select");

user.publicId.examples = [createId()];
user.name.examples = ["kd14"];
user.email.examples = ["kd14@yopmail.com"];
user.createdAt.examples = [1765357644270];
user.avatarUrl.examples = ["https://picsum.photos/200/300", ""];
user.updatedAt.examples = [1765357644270];

export namespace UserModel {
  export const meResponse = t.Object({
    id: user.publicId,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });

  export type meResponse = typeof meResponse.static;
}

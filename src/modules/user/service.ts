import { db } from "../../db/db";
import { user } from "../../db/schema/user";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../utils/errors";

export abstract class UserService {
  static async getById(publicId: string): Promise<typeof user.$inferSelect> {
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.publicId, publicId));

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    return existingUser;
  }

  static async getByEmail(email: string): Promise<typeof user.$inferSelect> {
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    return existingUser;
  }
}

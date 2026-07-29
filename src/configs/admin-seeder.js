import AdminUser from "../Models/admin/adminUserSchema.js";
import bcrypt from "bcrypt";

export const seedAdmin = async () => {
  try {
    const ADMIN_NAME = process.env.ADMIN_NAME?.trim();
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim();

    if (!ADMIN_NAME) {
      throw new Error("Admin name not found");
    }

    if (!ADMIN_EMAIL) {
      throw new Error("Admin email not found");
    }

    if (!ADMIN_PASSWORD) {
      throw new Error("Admin password not found");
    }

    const existingAdmin = await AdminUser.findOne({
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    await AdminUser.deleteMany({});

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await AdminUser.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("Default admin created.");
  } catch (error) {
    throw new Error("Error seeding admin : ", error);
  }
};

import { DataSource } from "apollo-datasource";
import db from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export class UserApi extends DataSource {
  constructor() {
    super();
  }

  async getUserById(id) {
    try {
      return await db.user.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getAllUsers() {
    try {
      return await db.user.findMany();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async createUser(name, password) {
    try {
      const newUser = await db.user.create({
        data: {
          name,
          password,
        },
      });

      return newUser;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteUser(id) {
    try {
      await db.user.delete({
        where: {
          id,
        },
      });
      return "user deleted successfully";
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getUserByName(name) {
    try {
      return await db.user.findFirst({
        where: {
          name,
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async generateToken(name, password) {
    try {
      const user = await this.getUserByName(name);
      if (!user) {
        throw new Error("User not found");
      }
  
      const passwordMatched = await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        throw new Error("Password mismatch");
      }
  
      const token = jwt.sign({ id: user.id, name: user.name }, "secret", {
        expiresIn: "365d",
      });
      return { token };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to generate token");
    }
  }
}

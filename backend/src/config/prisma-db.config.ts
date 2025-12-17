import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { configDotenv } from "dotenv";
configDotenv()

const pool = new Pool({ connectionString:process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma

/**
 * Idempotent seed: inserts DSA questions from frontend/src/data/dsa/generated.json
 * (same data the app builds from `dsa-lines`). Safe to run multiple times — skips rows
 * that already exist (by `link` when present, else title + topic + difficulty).
 *
 * Usage: cd backend && npm run insert-questions
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Question = require("../src/models/Question.model");

const GENERATED_JSON = path.join(
  __dirname,
  "../../frontend/src/data/dsa/generated.json"
);

function platformFromLink(link) {
  if (!link || typeof link !== "string") return undefined;
  if (/leetcode\.com/i.test(link)) return "LeetCode";
  if (/geeksforgeeks\.org/i.test(link)) return "GeeksforGeeks";
  if (/interviewbit\.com/i.test(link)) return "InterviewBit";
  return undefined;
}

function tripleKey(q) {
  return `${q.title}\0${q.topic}\0${q.difficulty}`;
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Configure backend/.env");
    process.exit(1);
  }

  if (!fs.existsSync(GENERATED_JSON)) {
    console.error("Missing file:", GENERATED_JSON);
    console.error("Generate it: cd frontend && npm run build:dsa");
    process.exit(1);
  }

  const raw = fs.readFileSync(GENERATED_JSON, "utf8");
  const { sheets } = JSON.parse(raw);
  if (!Array.isArray(sheets)) {
    console.error("Invalid generated.json: expected sheets array");
    process.exit(1);
  }

  const rows = sheets.flatMap((s) => (Array.isArray(s.questions) ? s.questions : []));
  const docs = rows.map((q) => {
    const link = q.link != null && String(q.link).trim() !== "" ? String(q.link).trim() : undefined;
    return {
      title: String(q.title).trim(),
      topic: String(q.topic).trim(),
      difficulty: q.difficulty,
      ...(link ? { link } : {}),
      platform: platformFromLink(link),
    };
  });

  await connectDB();

  const withLink = docs.filter((d) => d.link);
  const withoutLink = docs.filter((d) => !d.link);

  const links = [...new Set(withLink.map((d) => d.link))];
  const existingWithLink =
    links.length > 0 ? await Question.find({ link: { $in: links } }).select("link").lean() : [];
  const linkSet = new Set(existingWithLink.map((d) => d.link));

  const triples =
    withoutLink.length > 0
      ? await Question.find({
          $or: [{ link: null }, { link: "" }, { link: { $exists: false } }],
        })
          .select("title topic difficulty")
          .lean()
      : [];
  const tripleSet = new Set(triples.map((t) => tripleKey(t)));

  const toInsert = [
    ...withLink.filter((d) => !linkSet.has(d.link)),
    ...withoutLink.filter((d) => !tripleSet.has(tripleKey(d))),
  ];

  if (toInsert.length === 0) {
    console.log(`Nothing to insert — all ${docs.length} questions are already in the database.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const inserted = await Question.insertMany(toInsert, { ordered: false });
  const skipped = docs.length - toInsert.length;
  console.log(
    `insertMany: inserted ${inserted.length} new document(s) (${skipped} skipped as already present, ${docs.length} total in generated.json).`
  );

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  mongoose.disconnect().finally(() => process.exit(1));
});

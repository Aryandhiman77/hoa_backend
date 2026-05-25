import express from "express";
// import { getDB } from "../configs/dbConnection.js";

const router = express.Router();

const queues = {
  contact: {
    table: "contact_submissions",
    order: "created_at",
    statuses: ["New", "Under Review", "Needs Follow-Up", "Closed"],
  },
  stories: {
    table: "story_submissions",
    order: "created_at",
    statuses: [
      "New",
      "Under Review",
      "Needs Follow-Up",
      "Flagged",
      "Approved",
      "Published",
      "Archived",
    ],
  },
  advocate: {
    table: "advocate_requests",
    order: "created_at",
    statuses: [
      "New",
      "Under Review",
      "Needs Follow-Up",
      "Flagged",
      "Closed",
      "Archived",
    ],
  },
  attorneys: {
    table: "attorney_submissions",
    order: "created_at",
    statuses: ["New", "Under Review", "Approved", "Published", "Archived"],
  },
};

const editableFields = {
  status: "status",
  internal_notes: "internal_notes",
  assigned_reviewer: "assigned_reviewer",
  ai_summary: "ai_summary",
  urgency_score: "urgency_score",
  risk_score: "risk_score",
  ai_reply_draft: "ai_reply_draft",
};

function normalizeText(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value).trim() || null;
}

router.get("/queues/:queue", async (req, res, next) => {
  try {
    const config = queues[req.params.queue];

    if (!config) {
      return res.status(404).json({ message: "Queue not found." });
    }

    const [rows] = await getDB().query(
      `SELECT * FROM ${config.table} ORDER BY ${config.order} DESC LIMIT 100`,
    );

    res.json({ queue: req.params.queue, records: rows });
  } catch (error) {
    next(error);
  }
});

router.patch("/queues/:queue/:id", async (req, res, next) => {
  try {
    const config = queues[req.params.queue];

    if (!config) {
      return res.status(404).json({ message: "Queue not found." });
    }

    const updates = [];
    const values = [];

    for (const [bodyKey, column] of Object.entries(editableFields)) {
      if (Object.prototype.hasOwnProperty.call(req.body, bodyKey)) {
        if (
          bodyKey === "status" &&
          !config.statuses.includes(req.body.status)
        ) {
          return res.status(400).json({ message: "Invalid status for queue." });
        }

        updates.push(`${column} = ?`);
        values.push(normalizeText(req.body[bodyKey]));
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "ai_tags")) {
      updates.push("ai_tags = ?");
      values.push(JSON.stringify(req.body.ai_tags || []));
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No editable fields provided." });
    }

    values.push(req.params.id);

    const [result] = await getDB().query(
      `UPDATE ${config.table} SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found." });
    }

    const [rows] = await getDB().query(
      `SELECT * FROM ${config.table} WHERE id = ? LIMIT 1`,
      [req.params.id],
    );

    res.json({ queue: req.params.queue, record: rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;

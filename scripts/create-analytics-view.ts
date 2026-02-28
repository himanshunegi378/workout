import "dotenv/config";
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  });

  await client.connect();

  console.log("Creating exercise_analytics_view...");

  await client.query(`
  DROP VIEW IF EXISTS exercise_analytics_view;
  CREATE VIEW exercise_analytics_view AS
  SELECT
    el.id AS log_id,
    ws.id AS workout_session_id,
    COALESCE(ws.user_id, el.user_id) AS user_id,
    COALESCE(ws.date, el.date) AS session_date,
    ws.start_time,
    ws.end_time,
    wg.id AS programme_id,
    wg.name AS programme_name,
    w.id AS workout_id,
    w.name AS workout_name,
    COALESCE(e_planned.id, e_adhoc.id) AS exercise_id,
    COALESCE(e_planned.name, e_adhoc.name) AS exercise_name,
    COALESCE(e_planned.muscle_group, e_adhoc.muscle_group) AS muscle_group,
    el.exercise_with_metadata_id,
    em.reps_min,
    em.reps_max,
    em.sets_min,
    em.sets_max,
    em.rest_min,
    em.rest_max,
    em.tempo,
    em.order_index AS prescribed_order,
    COALESCE(el.weight, 0) AS weight,
    el.reps,
    el.set_order_index,
    COALESCE(el.weight * el.reps, 0) AS volume,
    (el.exercise_with_metadata_id IS NULL) AS is_ad_hoc_exercise
  FROM exercise_logs el
  LEFT JOIN workout_sessions ws ON el.workout_session_id = ws.id
  LEFT JOIN workouts w ON ws.workout_id = w.id
  LEFT JOIN programmes wg ON w.programme_id = wg.id
  LEFT JOIN exercise_with_metadata em ON el.exercise_with_metadata_id = em.id
  LEFT JOIN exercises e_planned ON em.exercise_id = e_planned.id
  LEFT JOIN exercises e_adhoc ON el.exercise_id = e_adhoc.id;
  `);

  console.log("exercise_analytics_view created successfully.");
  await client.end();
}

main().catch((err) => {
  console.error("Error creating view:", err);
  process.exit(1);
});

const dotenv = require("dotenv");

dotenv.config();

const { supabase } = require("../config/db");

const topics = [
  {
    title: "Biological Bases of Behavior",
    description: "Neuroscience foundations for BLEPP review.",
    order_index: 1,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Learning and Memory",
    description: "Conditioning, retention, and recall essentials.",
    order_index: 2,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Emotion and Motivation",
    description: "Core theories and BLEPP-relevant frameworks.",
    order_index: 3,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Theories of Personality",
    description: "Trait, psychodynamic, and humanistic views.",
    order_index: 4,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Psychological Assessment",
    description: "Testing, validity, reliability, and ethics.",
    order_index: 5,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Abnormal Psychology",
    description: "Disorders, diagnostics, and interventions.",
    order_index: 6,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Industrial-Organizational Psychology",
    description: "Workplace behavior and applied psychology.",
    order_index: 7,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Developmental Psychology",
    description: "Lifespan development milestones and theories.",
    order_index: 8,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Social Psychology",
    description: "Group dynamics, social cognition, attitudes.",
    order_index: 9,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Research Methods and Statistics",
    description: "Designs, analysis, and BLEPP-ready methods.",
    order_index: 10,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
  {
    title: "Counseling & Psychotherapy",
    description: "Counseling theories, helping skills, and psychotherapy approaches.",
    order_index: 11,
    subject_area: "BLEPP Core",
    is_preset: true,
  },
];

const run = async () => {
  const titles = topics.map((topic) => topic.title);
  const { data: existingTopics, error: readError } = await supabase
    .from("topics")
    .select("id, title")
    .in("title", titles);

  if (readError) {
    throw readError;
  }

  const existingTitles = new Set(
    (existingTopics || []).map((topic) => topic.title)
  );
  const topicsToInsert = topics.filter(
    (topic) => !existingTitles.has(topic.title)
  );

  let insertedCount = 0;
  if (topicsToInsert.length > 0) {
    const { data: insertedTopics, error: insertError } = await supabase
      .from("topics")
      .insert(topicsToInsert)
      .select("id");

    if (insertError) {
      throw insertError;
    }

    insertedCount = insertedTopics?.length || 0;
  }

  const topicsToUpdate = topics.filter((topic) =>
    existingTitles.has(topic.title)
  );

  let updatedCount = 0;
  for (const topic of topicsToUpdate) {
    const { data: updatedTopics, error: updateError } = await supabase
      .from("topics")
      .update(topic)
      .eq("title", topic.title)
      .is("user_id", null)
      .select("id");

    if (updateError) {
      throw updateError;
    }

    updatedCount += updatedTopics?.length || 0;
  }

  console.log(
    `Seeded topics: ${insertedCount} inserted, ${updatedCount} updated`
  );
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err.message || err);
    process.exit(1);
  });

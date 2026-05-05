const dotenv = require("dotenv");

dotenv.config();

const { supabase } = require("../config/db");

const topics = [
  {
    name: "Biological Bases of Behavior",
    description: "Neuroscience foundations for BLEPP review.",
    order_index: 1,
  },
  {
    name: "Learning and Memory",
    description: "Conditioning, retention, and recall essentials.",
    order_index: 2,
  },
  {
    name: "Emotion and Motivation",
    description: "Core theories and BLEPP-relevant frameworks.",
    order_index: 3,
  },
  {
    name: "Personality Theories",
    description: "Trait, psychodynamic, and humanistic views.",
    order_index: 4,
  },
  {
    name: "Psychological Assessment",
    description: "Testing, validity, reliability, and ethics.",
    order_index: 5,
  },
  {
    name: "Abnormal Psychology",
    description: "Disorders, diagnostics, and interventions.",
    order_index: 6,
  },
  {
    name: "Industrial-Organizational Psychology",
    description: "Workplace behavior and applied psychology.",
    order_index: 7,
  },
  {
    name: "Developmental Psychology",
    description: "Lifespan development milestones and theories.",
    order_index: 8,
  },
  {
    name: "Social Psychology",
    description: "Group dynamics, social cognition, attitudes.",
    order_index: 9,
  },
  {
    name: "Research Methods and Statistics",
    description: "Designs, analysis, and BLEPP-ready methods.",
    order_index: 10,
  },
];

const run = async () => {
  const { data, error } = await supabase
    .from("topics")
    .upsert(topics, { onConflict: "name" })
    .select("id, name");

  if (error) {
    throw error;
  }

  console.log("Seeded topics:", data?.length || 0);
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err.message || err);
    process.exit(1);
  });

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

const quizTemplates = [
  {
    topicTitle: "Biological Bases of Behavior",
    title: "Biological Bases Quick Check",
    questions: [
      {
        question_text: "Which structure is most directly involved in forming new explicit memories?",
        options: ["Amygdala", "Hippocampus", "Medulla", "Occipital lobe"],
        correct_answer: "Hippocampus",
        explanation: "The hippocampus supports consolidation of new explicit or declarative memories.",
      },
      {
        question_text: "What does the sympathetic nervous system primarily prepare the body for?",
        options: ["Rest and digestion", "Fight-or-flight response", "Long-term memory storage", "Fine motor sleep control"],
        correct_answer: "Fight-or-flight response",
        explanation: "Sympathetic activation increases arousal, heart rate, and readiness for action.",
      },
      {
        question_text: "Dopamine is most closely associated with which process?",
        options: ["Reward and motivation", "Visual acuity", "Bone growth", "Blood clotting"],
        correct_answer: "Reward and motivation",
        explanation: "Dopamine pathways are central to reward learning, motivation, and reinforcement.",
      },
    ],
  },
  {
    topicTitle: "Learning and Memory",
    title: "Learning and Memory Quick Check",
    questions: [
      {
        question_text: "In classical conditioning, the neutral stimulus becomes what after pairing?",
        options: ["Unconditioned stimulus", "Conditioned stimulus", "Conditioned response", "Extinction cue"],
        correct_answer: "Conditioned stimulus",
        explanation: "A neutral stimulus becomes a conditioned stimulus when it reliably predicts the unconditioned stimulus.",
      },
      {
        question_text: "Which schedule usually produces high, steady response rates?",
        options: ["Fixed interval", "Variable ratio", "Fixed time", "Continuous punishment"],
        correct_answer: "Variable ratio",
        explanation: "Variable ratio reinforcement rewards after unpredictable response counts, making behavior resistant to extinction.",
      },
      {
        question_text: "Retrieval practice improves learning mainly by strengthening what?",
        options: ["Encoding specificity only", "Access to stored information", "Sensory adaptation", "Motor reflexes"],
        correct_answer: "Access to stored information",
        explanation: "Practicing recall strengthens retrieval routes and reveals gaps in knowledge.",
      },
    ],
  },
  {
    topicTitle: "Emotion and Motivation",
    title: "Emotion and Motivation Quick Check",
    questions: [
      {
        question_text: "According to James-Lange theory, emotion follows what?",
        options: ["Bodily arousal", "Cognitive appraisal only", "Social comparison", "Dream imagery"],
        correct_answer: "Bodily arousal",
        explanation: "James-Lange theory proposes that physiological changes are interpreted as emotional experience.",
      },
      {
        question_text: "Maslow placed which need at the base of his hierarchy?",
        options: ["Esteem", "Self-actualization", "Physiological needs", "Belongingness"],
        correct_answer: "Physiological needs",
        explanation: "Basic survival needs such as food, water, and sleep form the foundation of the hierarchy.",
      },
      {
        question_text: "Intrinsic motivation means behavior is driven primarily by what?",
        options: ["External rewards", "Avoiding punishment", "Internal interest or satisfaction", "Peer pressure"],
        correct_answer: "Internal interest or satisfaction",
        explanation: "Intrinsic motivation comes from enjoyment, curiosity, or meaning in the activity itself.",
      },
    ],
  },
  {
    topicTitle: "Theories of Personality",
    title: "Personality Theories Quick Check",
    questions: [
      {
        question_text: "Which theorist emphasized self-actualization and the self-concept?",
        options: ["Carl Rogers", "B. F. Skinner", "Ivan Pavlov", "Hans Selye"],
        correct_answer: "Carl Rogers",
        explanation: "Rogers' humanistic theory focuses on self-concept, congruence, and growth toward self-actualization.",
      },
      {
        question_text: "The Big Five trait model includes which dimension?",
        options: ["Regression", "Extraversion", "Fixation", "Reciprocal determinism"],
        correct_answer: "Extraversion",
        explanation: "The Big Five are openness, conscientiousness, extraversion, agreeableness, and neuroticism.",
      },
      {
        question_text: "Freud's id is governed mainly by what principle?",
        options: ["Reality principle", "Pleasure principle", "Reciprocity principle", "Moral principle"],
        correct_answer: "Pleasure principle",
        explanation: "The id seeks immediate gratification and operates according to the pleasure principle.",
      },
    ],
  },
  {
    topicTitle: "Psychological Assessment",
    title: "Assessment Quick Check",
    questions: [
      {
        question_text: "Reliability refers to a test's what?",
        options: ["Consistency of measurement", "Ability to predict every behavior", "Cultural popularity", "Length of administration"],
        correct_answer: "Consistency of measurement",
        explanation: "Reliability concerns whether a measure produces consistent scores across items, raters, or occasions.",
      },
      {
        question_text: "Content validity asks whether a test adequately covers what?",
        options: ["The intended construct domain", "Only future job performance", "The examinee's mood", "The scoring software"],
        correct_answer: "The intended construct domain",
        explanation: "Content validity evaluates how well test items represent the full domain being measured.",
      },
      {
        question_text: "A norm-referenced score is interpreted by comparing it with what?",
        options: ["A comparison group", "The examiner's preference", "The item writer's answer", "A random clinical label"],
        correct_answer: "A comparison group",
        explanation: "Norm-referenced interpretation compares an individual's performance to a defined reference sample.",
      },
    ],
  },
  {
    topicTitle: "Abnormal Psychology",
    title: "Abnormal Psychology Quick Check",
    questions: [
      {
        question_text: "A diagnosis should consider distress, dysfunction, and what other concern?",
        options: ["Deviance or atypicality", "Favorite activities", "Exam length", "Birth order only"],
        correct_answer: "Deviance or atypicality",
        explanation: "Abnormal behavior is often evaluated through distress, dysfunction, deviance, and cultural context.",
      },
      {
        question_text: "Persistent low mood and loss of interest are core signs of what disorder category?",
        options: ["Depressive disorders", "Dissociative disorders", "Somatic symptom disorders", "Sleep-wake disorders"],
        correct_answer: "Depressive disorders",
        explanation: "Depressive disorders commonly involve depressed mood, anhedonia, and related cognitive or somatic symptoms.",
      },
      {
        question_text: "Exposure therapy is most directly based on which learning principle?",
        options: ["Extinction", "Latent learning", "Chunking", "Maturation"],
        correct_answer: "Extinction",
        explanation: "Repeated safe exposure can weaken conditioned fear responses through extinction learning.",
      },
    ],
  },
  {
    topicTitle: "Industrial-Organizational Psychology",
    title: "I-O Psychology Quick Check",
    questions: [
      {
        question_text: "Job analysis is used to identify what?",
        options: ["Work tasks and required KSAOs", "Employee birth order", "Only salary ranges", "Office color schemes"],
        correct_answer: "Work tasks and required KSAOs",
        explanation: "Job analysis documents tasks and the knowledge, skills, abilities, and other characteristics needed.",
      },
      {
        question_text: "A structured interview improves selection by increasing what?",
        options: ["Consistency and fairness", "Informal guessing", "Candidate anxiety", "Random scoring"],
        correct_answer: "Consistency and fairness",
        explanation: "Structured interviews use standardized questions and scoring, improving reliability and defensibility.",
      },
      {
        question_text: "Burnout is commonly characterized by exhaustion, cynicism, and what?",
        options: ["Reduced professional efficacy", "Improved sleep quality", "High euphoria", "Perfect morale"],
        correct_answer: "Reduced professional efficacy",
        explanation: "Burnout includes emotional exhaustion, depersonalization or cynicism, and reduced accomplishment.",
      },
    ],
  },
  {
    topicTitle: "Developmental Psychology",
    title: "Developmental Psychology Quick Check",
    questions: [
      {
        question_text: "Piaget's concrete operational stage is marked by improved ability to use what?",
        options: ["Logical operations on concrete events", "Abstract hypothetical reasoning only", "Reflexive sucking", "Object tracking only"],
        correct_answer: "Logical operations on concrete events",
        explanation: "Concrete operational children reason logically about tangible situations, including conservation.",
      },
      {
        question_text: "Secure attachment is typically associated with caregivers who are what?",
        options: ["Responsive and consistent", "Always absent", "Randomly punitive", "Emotionally unavailable only"],
        correct_answer: "Responsive and consistent",
        explanation: "Sensitive, consistent caregiving supports trust and secure attachment patterns.",
      },
      {
        question_text: "Erikson's adolescence stage centers on what psychosocial task?",
        options: ["Identity versus role confusion", "Trust versus mistrust", "Integrity versus despair", "Autonomy versus shame"],
        correct_answer: "Identity versus role confusion",
        explanation: "Adolescents explore roles, beliefs, and commitments while forming a coherent identity.",
      },
    ],
  },
  {
    topicTitle: "Social Psychology",
    title: "Social Psychology Quick Check",
    questions: [
      {
        question_text: "The fundamental attribution error is the tendency to overemphasize what?",
        options: ["Dispositional causes", "Weather patterns", "Statistical power", "Sleep cycles"],
        correct_answer: "Dispositional causes",
        explanation: "People often overattribute others' behavior to personality and underweight situational influences.",
      },
      {
        question_text: "Conformity increases when a group is unanimous, large, and what?",
        options: ["Important to the person", "Completely unknown", "Physically distant only", "Asleep"],
        correct_answer: "Important to the person",
        explanation: "Normative and informational pressures are stronger when group membership or accuracy matters.",
      },
      {
        question_text: "Cognitive dissonance occurs when a person experiences conflict between what?",
        options: ["Attitudes and behavior", "Two unrelated clocks", "Vision and hearing only", "Blood types"],
        correct_answer: "Attitudes and behavior",
        explanation: "Dissonance is discomfort from inconsistent cognitions, often motivating attitude or behavior change.",
      },
    ],
  },
  {
    topicTitle: "Research Methods and Statistics",
    title: "Research Methods Quick Check",
    questions: [
      {
        question_text: "Random assignment primarily helps support what?",
        options: ["Causal inference", "Longer surveys", "Larger fonts", "Participant payment"],
        correct_answer: "Causal inference",
        explanation: "Random assignment balances groups on confounds, strengthening causal conclusions in experiments.",
      },
      {
        question_text: "A p-value represents the probability of data at least as extreme assuming what?",
        options: ["The null hypothesis is true", "The sample is biased", "The measure is unreliable", "The theory is proven"],
        correct_answer: "The null hypothesis is true",
        explanation: "The p-value is calculated under the null model, not as the probability the null is true.",
      },
      {
        question_text: "Correlation cannot by itself establish what?",
        options: ["Causation", "Association", "Direction of relationship", "Covariation"],
        correct_answer: "Causation",
        explanation: "Correlations show relationships but do not rule out reverse causality or third variables.",
      },
    ],
  },
  {
    topicTitle: "Counseling & Psychotherapy",
    title: "Counseling and Psychotherapy Quick Check",
    questions: [
      {
        question_text: "Unconditional positive regard is central to which approach?",
        options: ["Person-centered therapy", "Classical conditioning", "Token economy", "Aversion therapy"],
        correct_answer: "Person-centered therapy",
        explanation: "Rogers emphasized empathy, genuineness, and unconditional positive regard in person-centered therapy.",
      },
      {
        question_text: "CBT commonly targets the relationship among thoughts, feelings, and what?",
        options: ["Behaviors", "Blood pressure only", "Reflex arcs", "Dream symbols only"],
        correct_answer: "Behaviors",
        explanation: "CBT links cognitions, emotions, and behaviors, using restructuring and behavioral strategies.",
      },
      {
        question_text: "In counseling ethics, confidentiality may be limited when there is what?",
        options: ["Serious risk of harm", "A minor scheduling conflict", "A difficult exam", "A preference for silence"],
        correct_answer: "Serious risk of harm",
        explanation: "Confidentiality has exceptions, including imminent danger, abuse reporting, and legal requirements.",
      },
    ],
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

  const { data: seededTopics, error: topicReadError } = await supabase
    .from("topics")
    .select("id, title")
    .in(
      "title",
      quizTemplates.map((quiz) => quiz.topicTitle)
    );

  if (topicReadError) {
    throw topicReadError;
  }

  const topicsByTitle = new Map(
    (seededTopics || []).map((topic) => [topic.title, topic])
  );

  let quizzesInserted = 0;
  let questionsInserted = 0;

  for (const template of quizTemplates) {
    const topic = topicsByTitle.get(template.topicTitle);
    if (!topic) {
      continue;
    }

    const { data: existingQuiz, error: quizReadError } = await supabase
      .from("quizzes")
      .select("id")
      .eq("topic_id", topic.id)
      .eq("title", template.title)
      .maybeSingle();

    if (quizReadError) {
      throw quizReadError;
    }

    let quizId = existingQuiz?.id;
    if (!quizId) {
      const { data: insertedQuiz, error: quizInsertError } = await supabase
        .from("quizzes")
        .insert([
          {
            topic_id: topic.id,
            title: template.title,
            total_questions: template.questions.length,
          },
        ])
        .select("id")
        .single();

      if (quizInsertError) {
        throw quizInsertError;
      }

      quizId = insertedQuiz.id;
      quizzesInserted += 1;
    } else {
      const { error: quizUpdateError } = await supabase
        .from("quizzes")
        .update({ total_questions: template.questions.length })
        .eq("id", quizId);

      if (quizUpdateError) {
        throw quizUpdateError;
      }
    }

    const { data: existingQuestions, error: questionReadError } =
      await supabase
        .from("quiz_questions")
        .select("id")
        .eq("quiz_id", quizId)
        .limit(1);

    if (questionReadError) {
      throw questionReadError;
    }

    if ((existingQuestions || []).length === 0) {
      const { data: insertedQuestions, error: questionInsertError } =
        await supabase
          .from("quiz_questions")
          .insert(
            template.questions.map((question, index) => ({
              ...question,
              quiz_id: quizId,
              order_index: index + 1,
            }))
          )
          .select("id");

      if (questionInsertError) {
        throw questionInsertError;
      }

      questionsInserted += insertedQuestions?.length || 0;
    }
  }

  console.log(
    `Seeded quizzes: ${quizzesInserted} inserted, ${questionsInserted} questions inserted`
  );
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err.message || err);
    process.exit(1);
  });

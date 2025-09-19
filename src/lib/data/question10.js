// Source questions with lettered options (a-e)
export const carrerQuestions = [
  {
    id: 1,
    question: "During a weekend, you would prefer to:",
    options: {
      a: "Build or repair something with your hands",
      b: "Read about scientific discoveries or research",
      c: "Create art, write poetry, or compose music",
      d: "Organize a community event or help neighbors",
      e: "Start a small business selling homemade items",
    },
  },
  {
    id: 2,
    question: "When your family is planning a vacation, you naturally:",
    options: {
      a: "Research the practical aspects like transport and accommodation",
      b: "Study the history and geography of the destination",
      c: "Look for museums, cultural sites, and local art",
      d: "Plan group activities that everyone can enjoy together",
      e: "Calculate the budget and find the best deals",
    },
  },
  {
    id: 3,
    question: "Your natural approach to solving problems is:",
    options: {
      a: "Using practical, hands-on methods",
      b: "Analyzing data and finding logical solutions",
      c: "Thinking outside the box with innovative ideas",
      d: "Bringing people together to find collaborative solutions",
      e: "Finding the most efficient and profitable approach",
    },
  },
  {
    id: 4,
    question: "In your free time, you enjoy:",
    options: {
      a: "Building things, gardening, or outdoor activities",
      b: "Reading, researching topics online, or solving puzzles",
      c: "Drawing, music, writing, or other creative hobbies",
      d: "Spending time with friends and helping others",
      e: "Planning events, managing social media, or learning about business",
    },
  },
  {
    id: 5,
    question: "When making decisions, you primarily consider:",
    options: {
      a: "What works best practically and efficiently",
      b: "What the evidence and logical analysis suggest",
      c: "What feels right intuitively and aligns with your values",
      d: "How it will affect others and contribute to the greater good",
      e: "What will lead to the best opportunities and outcomes",
    },
  },
  {
    id: 6,
    question: "When faced with a difficult task, you:",
    options: {
      a: "Break it down into manageable, practical steps",
      b: "Research thoroughly and create a systematic approach",
      c: "Look for creative and unconventional solutions",
      d: "Seek input and support from others",
      e: "Focus on the end goal and find the most strategic path",
    },
  },
  {
    id: 7,
    question: "When choosing a career, your top priority would be:",
    options: {
      a: "Job security and practical skills that are always needed",
      b: "Intellectual challenge and opportunities for continuous learning",
      c: "Creative fulfillment and personal expression",
      d: "Making a positive impact on people's lives",
      e: "Financial success and leadership opportunities",
    },
  },
  {
    id: 8,
    question: "Your approach to teamwork is:",
    options: {
      a: "Contributing practical skills and getting things done",
      b: "Providing research, analysis, and technical expertise",
      c: "Bringing creative ideas and innovative perspectives",
      d: "Facilitating communication and ensuring everyone is included",
      e: "Taking leadership roles and driving toward objectives",
    },
  },
  {
    id: 9,
    question: "When choosing extracurricular activities, you're drawn to:",
    options: {
      a: "Sports, technical clubs, or hands-on competitions",
      b: "Academic clubs, research projects, or intellectual competitions",
      c: "Arts clubs, creative writing, music, or cultural activities",
      d: "Student government, volunteering, or social service clubs",
      e: "Business clubs, entrepreneurship activities, or leadership roles",
    },
  },
  {
    id: 10,
    question: "Your approach to money and financial planning is:",
    options: {
      a: "Saving for practical purchases and tools you need",
      b: "Investing in education and knowledge-building resources",
      c: "Spending on experiences and creative tools that inspire you",
      d: "Using money to help others and support causes you believe in",
      e: "Viewing money as a tool for creating opportunities and building wealth",
    },
  },
  {
    id: 11,
    question: "When facing a career decision, you would most likely:",
    options: {
      a: "Choose based on job security and practical benefits",
      b: "Choose based on intellectual interest and learning opportunities",
      c: "Choose based on creative fulfillment and personal expression",
      d: "Choose based on ability to help others and make a social impact",
      e: "Choose based on advancement potential and financial rewards",
    },
  },
  {
    id: 12,
    question: "When you encounter a new technology or innovation, your first thought is:",
    options: {
      a: "'How does this work and could I build or repair it?'",
      b: "'What are the scientific principles behind this?'",
      c: "'How could this be used creatively or artistically?'",
      d: "'How could this help people and improve their lives?'",
      e: "'What business opportunities does this create?'",
    },
  },
];

// Normalized questions for UI: options as array of { value, text }
export const careerQuestions = carrerQuestions.map((q) => ({
  id: q.id,
  question: q.question,
  options: Object.entries(q.options).map(([value, text]) => ({ value, text })),
}));

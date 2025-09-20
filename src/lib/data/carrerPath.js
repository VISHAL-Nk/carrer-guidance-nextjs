const careerPaths = {
  "Science Stream": {
    name: "Science Stream",
    description: "Focus on Physics, Chemistry, Mathematics/Biology leading to engineering, medicine, research, and technology careers.",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
    careerOptions: {
      "Engineer": {
        subRoles: {
          "Software Engineer": {
            salary: "6–12 LPA (entry), 20+ LPA (experienced)",
            companies: ["Infosys", "TCS", "Wipro", "HCL", "Accenture"]
          },
          "Data Scientist": {
            salary: "8–15 LPA (entry), 20–30 LPA (experienced)",
            companies: ["Flipkart", "Amazon India", "Microsoft", "Google", "Mu Sigma"]
          },
          "ML Engineer": {
            salary: "10–18 LPA (entry), 25–40 LPA (experienced)",
            companies: ["NVIDIA", "Google", "Adobe", "Swiggy", "Zomato"]
          },
          "Civil Engineer": {
            salary: "3–6 LPA",
            companies: ["Larsen & Toubro", "Tata Projects", "Shapoorji Pallonji"]
          },
          "Mechanical Engineer": {
            salary: "3–6 LPA",
            companies: ["Tata Motors", "Ashok Leyland", "Mahindra & Mahindra"]
          },
          "Electrical Engineer": {
            salary: "3–7 LPA",
            companies: ["Siemens", "BHEL", "ABB", "GE India"]
          },
          "Electronics Engineer": {
            salary: "4–8 LPA",
            companies: ["Intel India", "Samsung R&D", "Texas Instruments"]
          },
          "Chemical Engineer": {
            salary: "4–9 LPA",
            companies: ["Reliance Industries", "ONGC", "Indian Oil"]
          }
        }
      },
      "Doctor": {
        subRoles: {
          "General Physician": {
            salary: "5–10 LPA",
            companies: ["Apollo Hospitals", "Fortis Healthcare", "AIIMS"]
          },
          "Surgeon": {
            salary: "15–30 LPA",
            companies: ["Apollo Hospitals", "Max Healthcare", "Medanta"]
          },
          "Pediatrician": {
            salary: "8–15 LPA",
            companies: ["Rainbow Hospitals", "Cloudnine Hospitals"]
          },
          "Dentist": {
            salary: "5–12 LPA",
            companies: ["Clove Dental", "Apollo Dental"]
          },
          "Psychiatrist": {
            salary: "10–20 LPA",
            companies: ["NIMHANS", "Fortis Mental Health", "Apollo"]
          },
          "Dermatologist": {
            salary: "8–18 LPA",
            companies: ["VLCC", "Apollo Cosmetic Clinics"]
          },
          "Orthopedic Doctor": {
            salary: "10–20 LPA",
            companies: ["Medanta", "Apollo Hospitals"]
          }
        }
      },
      "Scientist": {
        subRoles: {
          "Research Scientist": {
            salary: "6–12 LPA",
            companies: ["DRDO", "CSIR", "ISRO", "ICMR"]
          },
          "AI Researcher": {
            salary: "12–25 LPA",
            companies: ["Google Research India", "Microsoft Research", "IITs"]
          },
          "Space Scientist": {
            salary: "10–20 LPA",
            companies: ["ISRO", "DRDO"]
          },
          "Biotech Scientist": {
            salary: "6–15 LPA",
            companies: ["Biocon", "Serum Institute", "CSIR Labs"]
          },
          "Environmental Scientist": {
            salary: "5–10 LPA",
            companies: ["NEERI", "TERI", "Environmental NGOs"]
          },
          "Data Scientist (Research)": {
            salary: "10–20 LPA",
            companies: ["IIT Research Labs", "Mu Sigma", "Accenture AI Labs"]
          }
        }
      },
      "Pharmacist": {
        subRoles: {
          "Clinical Pharmacist": {
            salary: "3–6 LPA",
            companies: ["Apollo Pharmacy", "MedPlus", "Fortis"]
          },
          "Hospital Pharmacist": {
            salary: "4–7 LPA",
            companies: ["Apollo Hospitals", "Max Healthcare"]
          },
          "Pharmaceutical Researcher": {
            salary: "6–12 LPA",
            companies: ["Sun Pharma", "Cipla", "Dr. Reddy’s"]
          },
          "Regulatory Affairs Specialist": {
            salary: "5–10 LPA",
            companies: ["Novartis India", "Pfizer India"]
          }
        }
      },
      "Biotechnologist": {
        subRoles: {
          "Genetic Engineer": {
            salary: "6–12 LPA",
            companies: ["Biocon", "Serum Institute"]
          },
          "Biomedical Scientist": {
            salary: "5–10 LPA",
            companies: ["Philips Healthcare", "GE Healthcare"]
          },
          "Agricultural Biotechnologist": {
            salary: "4–8 LPA",
            companies: ["Monsanto India", "Mahyco"]
          },
          "Microbiologist": {
            salary: "4–9 LPA",
            companies: ["CSIR Labs", "Serum Institute", "Biocon"]
          }
        }
      }
    }
  },

  "Commerce Stream": {
    name: "Commerce Stream",
    description: "Emphasis on business, finance, and economics leading to careers in management, accounting, banking, and entrepreneurship.",
    subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics", "Informatics Practices"],
    careerOptions: {
      "Entrepreneur": {
        subRoles: {
          "Startup Founder": {
            salary: "Variable (0–∞, avg early stage 5–15 LPA)",
            companies: ["Self-owned Startup", "Incubators", "Accelerators"]
          },
          "Small Business Owner": {
            salary: "3–8 LPA",
            companies: ["Local Enterprises"]
          },
          "Tech Entrepreneur": {
            salary: "10–50+ LPA",
            companies: ["Startup Ecosystem (Bangalore, Hyderabad, Pune)"]
          },
          "Social Entrepreneur": {
            salary: "4–10 LPA",
            companies: ["NGOs", "CSR Startups"]
          }
        }
      },
      "Banker": {
        subRoles: {
          "Investment Banker": {
            salary: "12–25 LPA (entry), 30–60+ LPA (senior)",
            companies: ["Goldman Sachs India", "JP Morgan India", "ICICI Bank"]
          },
          "Retail Banker": {
            salary: "4–8 LPA",
            companies: ["SBI", "HDFC Bank", "Axis Bank"]
          },
          "Credit Analyst": {
            salary: "6–10 LPA",
            companies: ["ICICI Bank", "HDFC Bank"]
          },
          "Risk Manager": {
            salary: "8–15 LPA",
            companies: ["KPMG India", "EY India", "PwC"]
          },
          "Relationship Manager": {
            salary: "5–10 LPA",
            companies: ["HDFC Bank", "Axis Bank"]
          }
        }
      },
      "Chartered Accountant": {
        subRoles: {
          "Audit Associate": {
            salary: "7–10 LPA",
            companies: ["KPMG", "EY", "Deloitte", "PwC"]
          },
          "Tax Consultant": {
            salary: "7–12 LPA",
            companies: ["Grant Thornton", "EY", "PwC"]
          },
          "Financial Analyst": {
            salary: "8–15 LPA",
            companies: ["ICICI Securities", "Kotak Mahindra Bank"]
          },
          "Forensic Accountant": {
            salary: "10–18 LPA",
            companies: ["Deloitte India", "EY Forensics"]
          },
          "Corporate Finance Advisor": {
            salary: "12–20 LPA",
            companies: ["JP Morgan", "Goldman Sachs", "Morgan Stanley"]
          }
        }
      },
      "Marketing Executive": {
        subRoles: {
          "Digital Marketing Executive": {
            salary: "3–6 LPA",
            companies: ["Zomato", "Swiggy", "Flipkart"]
          },
          "SEO Specialist": {
            salary: "4–7 LPA",
            companies: ["Webchutney", "AdGlobal360"]
          },
          "Brand Manager": {
            salary: "10–20 LPA",
            companies: ["HUL", "Procter & Gamble", "Nestlé"]
          },
          "Market Research Analyst": {
            salary: "5–9 LPA",
            companies: ["NielsenIQ", "IMRB", "Kantar"]
          },
          "Content Marketing Specialist": {
            salary: "4–8 LPA",
            companies: ["Times Internet", "YourStory", "NDTV"]
          }
        }
      }
    }
  },

  "Arts/Humanities Stream": {
    name: "Arts/Humanities Stream",
    description: "Creative and social sciences pathway ideal for design, media, education, civil services, and social work careers.",
    subjects: ["History", "Political Science", "Sociology", "Psychology", "Fine Arts"],
    careerOptions: {
      "Teacher": {
        subRoles: {
          "Primary School Teacher": {
            salary: "2–4 LPA",
            companies: ["Kendriya Vidyalaya", "Delhi Public School"]
          },
          "High School Teacher": {
            salary: "3–6 LPA",
            companies: ["CBSE Schools", "State Government Schools"]
          },
          "College Lecturer": {
            salary: "5–8 LPA",
            companies: ["DU Colleges", "Private Universities"]
          },
          "Professor": {
            salary: "8–15 LPA",
            companies: ["IITs", "Central Universities"]
          },
          "Online Tutor": {
            salary: "3–7 LPA",
            companies: ["BYJU’s", "Vedantu", "Unacademy"]
          }
        }
      },
      "Social Worker": {
        subRoles: {
          "NGO Worker": {
            salary: "2–5 LPA",
            companies: ["CRY India", "Smile Foundation"]
          },
          "Community Development Officer": {
            salary: "3–6 LPA",
            companies: ["State Government Schemes", "NGOs"]
          },
          "Rehabilitation Counselor": {
            salary: "4–7 LPA",
            companies: ["NIMHANS", "Rehabilitation NGOs"]
          },
          "Policy Analyst": {
            salary: "6–12 LPA",
            companies: ["NITI Aayog", "UNDP India", "PRS India"]
          }
        }
      },
      "Writer": {
        subRoles: {
          "Content Writer": {
            salary: "3–5 LPA",
            companies: ["Times Internet", "The Hindu", "NDTV"]
          },
          "Journalist": {
            salary: "4–8 LPA",
            companies: ["India Today", "The Indian Express", "ANI"]
          },
          "Author": {
            salary: "Variable (avg 5–12 LPA)",
            companies: ["Self-Published", "Penguin India", "HarperCollins India"]
          },
          "Copywriter": {
            salary: "4–7 LPA",
            companies: ["Ogilvy", "JWT", "Leo Burnett"]
          }
        }
      },
      "Graphic Designer": {
        subRoles: {
          "UI/UX Designer": {
            salary: "5–10 LPA",
            companies: ["Adobe", "Infosys", "Flipkart"]
          },
          "Brand Identity Designer": {
            salary: "4–8 LPA",
            companies: ["Ogilvy", "Landor", "Local Startups"]
          },
          "Motion Graphics Designer": {
            salary: "6–12 LPA",
            companies: ["Byju’s", "Dream11", "Disney India"]
          }
        }
      },
      "Musician": {
        subRoles: {
          "Singer": {
            salary: "3–10 LPA (avg, varies by fame)",
            companies: ["Independent", "Bollywood Industry"]
          },
          "Composer": {
            salary: "4–12 LPA",
            companies: ["T-Series", "Sony Music India"]
          },
          "Music Producer": {
            salary: "6–15 LPA",
            companies: ["Zee Music", "Universal Music India"]
          },
          "Instrumentalist": {
            salary: "3–7 LPA",
            companies: ["Live Bands", "Studio Sessions"]
          }
        }
      }
    }
  },

  "Diploma Courses": {
    name: "Diploma Courses",
    description: "Job-oriented technical diploma programs after 10th for early specialization in engineering trades and applied sciences.",
    subjects: ["Applied Mathematics", "Workshop Practice", "Electrical Basics", "Mechanics"],
    careerOptions: {
      "Technician": {
        subRoles: {
          "Electrical Technician": {
            salary: "2–4 LPA",
            companies: ["BHEL", "Siemens", "ABB"]
          },
          "Mechanical Technician": {
            salary: "2.5–4.5 LPA",
            companies: ["Tata Motors", "Mahindra", "Ashok Leyland"]
          },
          "Lab Technician": {
            salary: "3–6 LPA",
            companies: ["Apollo Labs", "Pathkind Labs", "Dr. Lal PathLabs"]
          },
          "Maintenance Technician": {
            salary: "3–5 LPA",
            companies: ["Manufacturing Units", "Railways"]
          },
          "IT Support Technician": {
            salary: "3–6 LPA",
            companies: ["Infosys", "Wipro", "HCL"]
          }
        }
      },
      "Junior Engineer": {
        subRoles: {
          "Civil Junior Engineer": {
            salary: "3–5 LPA",
            companies: ["L&T", "NBCC", "CPWD"]
          },
          "Mechanical Junior Engineer": {
            salary: "3–5 LPA",
            companies: ["BHEL", "Tata Power"]
          },
          "Electrical Junior Engineer": {
            salary: "3–6 LPA",
            companies: ["Power Grid Corporation", "NTPC"]
          },
          "Electronics Junior Engineer": {
            salary: "3–6 LPA",
            companies: ["BEL", "ISRO", "DRDO"]
          }
        }
      },
      "Lab Assistant": {
        subRoles: {
          "Chemistry Lab Assistant": {
            salary: "2.5–4.5 LPA",
            companies: ["College Labs", "Pharma Labs"]
          },
          "Biology Lab Assistant": {
            salary: "3–5 LPA",
            companies: ["Research Labs", "Universities"]
          },
          "Physics Lab Assistant": {
            salary: "3–5 LPA",
            companies: ["College Labs", "Research Institutes"]
          }
        }
      }
    }
  },

  "Vocational Training": {
    name: "Vocational Training",
    description: "Hands-on ITI and vocational programs that develop practical skills for immediate employment across trades.",
    subjects: ["Trade Theory", "Workshop Practice", "Safety & Tools"],
    careerOptions: {
      "Fitter": {
        subRoles: {
          "Mechanical Fitter": {
            salary: "2–4 LPA",
            companies: ["Railways", "BHEL", "L&T"]
          },
          "Pipe Fitter": {
            salary: "2.5–4.5 LPA",
            companies: ["Oil & Gas Companies", "Construction Firms"]
          },
          "Assembly Line Fitter": {
            salary: "2.5–5 LPA",
            companies: ["Maruti Suzuki", "Tata Motors"]
          }
        }
      },
      "Electrician": {
        subRoles: {
          "Residential Electrician": {
            salary: "2.5–4 LPA",
            companies: ["Local Contractors", "Self-employed"]
          },
          "Industrial Electrician": {
            salary: "3–6 LPA",
            companies: ["Siemens", "ABB", "Reliance"]
          },
          "Maintenance Electrician": {
            salary: "3–5 LPA",
            companies: ["Factories", "Construction Firms"]
          }
        }
      },
      "Welder": {
        subRoles: {
          "Arc Welder": {
            salary: "2–4 LPA",
            companies: ["Shipyards", "Railways Workshops"]
          },
          "MIG Welder": {
            salary: "3–5 LPA",
            companies: ["Automobile Industry", "L&T"]
          },
          "TIG Welder": {
            salary: "3.5–6 LPA",
            companies: ["Heavy Engineering", "Oil & Gas Industry"]
          }
        }
      },
      "Mechanic": {
        subRoles: {
          "Automobile Mechanic": {
            salary: "2.5–5 LPA",
            companies: ["Maruti Suzuki", "Hero MotoCorp", "Tata Motors"]
          },
          "Diesel Mechanic": {
            salary: "3–6 LPA",
            companies: ["Indian Railways", "Transport Companies"]
          },
          "AC Mechanic": {
            salary: "3–5 LPA",
            companies: ["Blue Star", "Voltas", "LG India"]
          },
          "Motorcycle Mechanic": {
            salary: "2–4 LPA",
            companies: ["Bajaj Auto", "TVS Motors"]
          }
        }
      }
    }
  }
};

export { careerPaths };
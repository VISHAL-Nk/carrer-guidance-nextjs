export const flowchart = {
    "Science Stream":`
    flowchart TD
    A10[10th Standard] --> A12[11th-12th Science - PCM / PCB]

    A12 --> ENTRY{Entrance Exams}
    ENTRY --> JEE[JEE - Engineering]
    ENTRY --> NEET[NEET - Medical]
    ENTRY --> CUET[CUET / Other Exams]

    JEE --> UG_ENG(UG - B.Tech or B.E)
    NEET --> UG_MED(UG - MBBS or BDS)
    CUET --> UG_SCI(UG - B.Sc Physics / Chemistry / Biology / Maths)

    UG_ENG --> GATE{GATE Exam}
    UG_ENG --> JOB_ENG[Engineering Jobs]

    UG_MED --> INTERNSHIP(Medical Internship)
    UG_MED --> NEET_PG{NEET PG Exam}

    UG_SCI --> MASTERS_SCI(PG - M.Sc)
    UG_SCI --> GOVT_EXAMS{UPSC / SSC / Other Exams}

    GATE --> PG_ENG(PG - M.Tech or M.E)
    PG_ENG --> PHD_ENG(PhD in Engineering)
    PHD_ENG --> CAREER_ENG[Research / Corporate Careers]

    JOB_ENG --> CAREER_ENG

    INTERNSHIP --> PG_MED(PG - MD or MS)
    NEET_PG --> PG_MED
    PG_MED --> SUPER_SPEC(DM or MCh)
    SUPER_SPEC --> CAREER_MED[Specialist Doctor]
    PG_MED --> CAREER_MED[Medical Practice]

    MASTERS_SCI --> PHD_SCI(PhD in Sciences)
    PHD_SCI --> CAREER_SCI[Research / Academia / Scientist]
    GOVT_EXAMS --> CAREER_GOVT[Government Careers]

    `,
    "Commerce Stream":`
    flowchart TD
    A10[10th Standard] --> A12[11th-12th Commerce]
    A12 --> ENTRY{Admission Mode}
    ENTRY --> CUET[CUET / Entrance Exams]
    ENTRY --> DIRECT[Direct Admission]

    CUET --> UG_COM(UG - B.Com / BBA / BMS)
    DIRECT --> UG_COM

    UG_COM --> PROF{Professional Courses}
    PROF --> CA(Chartered Accountant)
    CA --> PG_COM(PG - M.Com / MBA / PGDM)

    PROF --> CS(Company Secretary)
    CS --> PG_COM

    PROF --> CMA(Cost & Management Accountant)
    CMA --> PG_COM

    PROF --> CFA(Chartered Financial Analyst)
    CFA --> PG_COM

    PROF --> ACCA(Global Accounting - ACCA/CPA)
    ACCA --> PG_COM

    PG_COM --> CAREER[Corporate Careers / Finance / Govt Exams / Teaching / Research]
`,
    "Arts/Humanities Stream":`
    flowchart TD
    A10[10th Standard] --> A12[11th-12th Arts/Humanities]
    A12 --> ENTRY{Admission Mode}
    ENTRY --> CUET[CUET / Entrance Exams]
    ENTRY --> DIRECT[Direct Admission]

    CUET --> UG_ARTS(UG - B.A / BFA / BJMC / BSW / Other Arts Degrees)
    DIRECT --> UG_ARTS

    UG_ARTS --> PG_ARTS(PG - M.A / MSW / MJMC / MFA / M.Ed)
    PG_ARTS --> PROF{Specialized/Professional Courses}

    PROF --> LLB(Law - LLB)
    LLB --> CAREER_LAW[Legal Careers / Judiciary]

    PROF --> UPSC{UPSC / Civil Services Prep}
    UPSC --> CAREER_CIVIL[IAS / IPS / IFS / Other Services]

    PROF --> UGC_NET(UGC-NET / JRF)
    UGC_NET --> CAREER_ACAD[Teaching / Research Careers]

    PG_ARTS --> CAREER_OTHER[Media / Social Work / Design / NGOs / Corporate Roles]
`,
    "Diploma Courses":`
    flowchart TD
    A10[10th Standard] --> DIP[Diploma Courses - Engineering / Design / Vocational]

    DIP --> PATH{Next Step}
    PATH --> LATERAL(Lateral Entry to 2nd Year B.Tech/B.E)
    PATH --> DIP_JOBS[Entry-Level Technical Jobs]

    LATERAL --> UG_ENG(UG - B.Tech / B.E via Lateral Entry)
    UG_ENG --> GATE{GATE Exam}
    UG_ENG --> UG_JOBS[Engineering Jobs]

    GATE --> PG_ENG(PG - M.Tech / MBA)
    PG_ENG --> PHD_ENG(PhD in Engineering)
    PHD_ENG --> CAREER_RESEARCH[Research / Academia / Corporate R&D]

    UG_JOBS --> CAREER_ENG[Industry Careers]

    DIP_JOBS --> CAREER_DIP[Skilled Technician / Government & Private Sector Roles]
`,
    "Vocational Training":`
    flowchart TD
    A10[10th Standard] --> VOC[Vocational Training Courses - ITI / NSDC / Skill Development]
    A12[12th Standard] --> VOC

    VOC --> PATH{Next Step}
    PATH --> JOBS[Skilled Jobs - Technician / Craftsman / Service Industry]
    PATH --> DIP[Diploma Courses - Polytechnic / Specialized Fields]
    PATH --> CERT[Certification Programs - Advanced Skills / Short-Term Courses]

    DIP --> LATERAL(Lateral Entry to UG - B.Tech/B.Voc)
    LATERAL --> UG(UG - B.Voc / B.Tech / BBA in Vocational Studies)

    UG --> PG(PG - M.Voc / MBA / M.Tech)
    PG --> CAREER_PRO[Professional Careers / Research / Industry Leadership]

    CERT --> JOBS

    JOBS --> CAREER[Careers - Govt Sector / Private Sector / Entrepreneurship]
`
};
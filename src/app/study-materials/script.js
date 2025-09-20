// Data for the application
const streamsData = {
    science: {
        id: 'science',
        name: 'Science (PCM/PCB)',
        description: 'Physics, Chemistry, Mathematics/Biology stream for engineering and medical aspirants',
        color: 'blue',
        subjects: [
            {
                id: 'physics',
                name: 'Physics',
                description: 'Mechanics, Thermodynamics, Optics, and Modern Physics',
                icon: 'fas fa-atom',
                materials: { notes: 10, tests: 10, videos: 10, books: 12 }
            },
            {
                id: 'chemistry',
                name: 'Chemistry',
                description: 'Organic, Inorganic, and Physical Chemistry',
                icon: 'fas fa-flask',
                materials: { notes: 10, tests: 10, videos: 12, books: 10 }
            },
            {
                id: 'mathematics',
                name: 'Mathematics',
                description: 'Calculus, Algebra, Coordinate Geometry, and Trigonometry',
                icon: 'fas fa-calculator',
                materials: { notes: 12, tests: 10, videos: 21, books: 8 }
            },
            {
                id: 'biology',
                name: 'Biology',
                description: 'Botany, Zoology, and Human Physiology',
                icon: 'fas fa-leaf',
                materials: { notes: 10, tests: 15, videos: 10, books: 5 }
            }
        ]
    },
    commerce: {
        id: 'commerce',
        name: 'Commerce',
        description: 'Business Studies, Economics, and Accountancy for future entrepreneurs',
        color: 'green',
        subjects: [
            {
                id: 'accountancy',
                name: 'Accountancy',
                description: 'Financial Accounting, Cost Accounting, and Company Accounts',
                icon: 'fas fa-calculator',
                materials: { notes: 5, tests: 10, videos: 18, books: 12 }
            },
            {
                id: 'business-studies',
                name: 'Business Studies',
                description: 'Management, Marketing, and Business Environment',
                icon: 'fas fa-briefcase',
                materials: { notes: 12, tests: 18, videos: 15, books: 10 }
            },
            {
                id: 'economics',
                name: 'Economics',
                description: 'Microeconomics, Macroeconomics, and Indian Economic Development',
                icon: 'fas fa-chart-line',
                materials: { notes: 18, tests: 12, videos: 10, books: 4 }
            },
            {
                id: 'english',
                name: 'English',
                description: 'Literature, Grammar, and Business Communication',
                icon: 'fas fa-book-open',
                materials: { notes: 10, tests: 15, videos: 12, books: 18 }
            }
        ]
    },
    arts: {
        id: 'arts',
        name: 'Arts/Humanities',
        description: 'History, Political Science, and Literature for creative minds',
        color: 'purple',
        subjects: [
            {
                id: 'history',
                name: 'History',
                description: 'Ancient, Medieval, and Modern History of India and World',
                icon: 'fas fa-clock',
                materials: { notes: 15, tests: 10, videos: 12, books: 10 }
            },
            {
                id: 'political-science',
                name: 'Political Science',
                description: 'Indian Constitution, Political Theory, and International Relations',
                icon: 'fas fa-users',
                materials: { notes: 10, tests: 15, videos: 14, books: 6 }
            },
            {
                id: 'geography',
                name: 'Geography',
                description: 'Physical Geography, Human Geography, and Map Work',
                icon: 'fas fa-globe',
                materials: { notes: 15, tests: 18, videos: 5, books: 2 }
            },
            {
                id: 'psychology',
                name: 'Psychology',
                description: 'General Psychology, Social Psychology, and Research Methods',
                icon: 'fas fa-brain',
                materials: { notes: 12, tests: 2, videos: 5, books: 8 }
            }
        ]
    }
};

const materialTypes = {
    notes: {
        title: 'Study Notes',
        icon: 'fas fa-file-alt',
        description: 'Comprehensive notes and summaries',
        resources: [
            {
                title: 'Chapter-wise Notes',
                description: 'Detailed notes for each chapter with important concepts highlighted',
                links: [
                    { text: 'Download PDF', url: 'https://ncert.nic.in/textbook/pdf/keph1dd.zip' },
                    { text: 'View Online', url: 'https://ncert.nic.in/textbook.php?keph1=0-7' }
                ]
            },
            {
                title: 'Revision Notes',
                description: 'Quick revision notes for last-minute preparation',
                links: [
                    { text: 'Download PDF', url: 'https://drive.google.com/folderview?id=10B_vUSjgUSwwy1LQrxrZHKc6AqmTcFcT' },
                    { text: 'View Online', url: 'https://www.raiedu.in/p/ncert-note.html' }
                ]
            },
            {
                title: 'Formula Sheets',
                description: 'All important formulas compiled in one place',
                links: [
                    { text: 'Download PDF', url: 'https://www.mathongo.com/dw/formula-sheets/?subject=Physics' },
                    { text: 'View Online', url: 'https://www.concepts-of-physics.com/pdf/physics-formulas.pdf' }
                ]
            },
            {
                title: 'Important Questions',
                description: 'Most frequently asked questions in exams',
                links: [
                    { text: 'Download PDF', url: 'https://example.com/notes/important-questions.pdf' },
                    { text: 'View Online', url: 'https://www.selfstudys.com/books/cbse-important-questions/english/11th/physics/49819#google_vignette' }
                ]
            }
        ]
    },
    tests: {
        title: 'Practice Tests',
        icon: 'fas fa-vial',
        description: 'Mock tests and practice papers',
        resources: [
            {
                title: 'Chapter-wise Tests',
                description: 'Tests for each chapter to check your understanding',
                links: [
                    { text: 'Take Test Online', url: 'https://test.sanfoundry.com/class-11-physics-tests/' },
                    { text: 'Download PDF', url: 'https://example.com/tests/chapter1.pdf' }
                ]
            },
            {
                title: 'Previous Year Papers',
                description: 'Previous year question papers with solutions',
                links: [
                    { text: 'View Solutions', url: 'https://example.com/tests/previous-year' },
                    { text: 'Download Papers', url: 'https://ncert.nic.in/pdf/publication/exemplarproblem/classXI/physics/keep317.pdf' }
                ]
            },
            {
                title: 'Mock Exams',
                description: 'Full-length mock exams simulating real test conditions',
                links: [
                    { text: 'Take Mock Test', url: 'https://example.com/tests/mock-exam' },
                    { text: 'Download Answer Key', url: 'https://example.com/tests/answer-key.pdf' }
                ]
            },
            {
                title: 'Topic-wise Quizzes',
                description: 'Short quizzes for specific topics',
                links: [
                    { text: 'Take Quiz', url: 'https://example.com/tests/quiz1' },
                    { text: 'Download Questions', url: 'https://example.com/tests/quiz1.pdf' }
                ]
            }
        ]
    },
    videos: {
        title: 'Video Lectures',
        icon: 'fas fa-play',
        description: 'Educational video content',
        resources: [
            {
                title: 'Concept Videos',
                description: 'Detailed explanations of important concepts',
                links: [
                    { text: 'Watch on YouTube', url: 'https://youtube.com/playlist?list=ABC123' },
                    { text: 'Download Videos', url: 'https://example.com/videos/concepts.zip' }
                ]
            },
            {
                title: 'Problem Solving',
                description: 'Step-by-step solutions to problems',
                links: [
                    { text: 'Watch on YouTube', url: 'https://youtube.com/playlist?list=DEF456' },
                    { text: 'Download Videos', url: 'https://example.com/videos/problems.zip' }
                ]
            },
            {
                title: 'Revision Videos',
                description: 'Quick revision of entire chapters',
                links: [
                    { text: 'Watch on YouTube', url: 'https://youtube.com/playlist?list=GHI789' },
                    { text: 'Download Videos', url: 'https://example.com/videos/revision.zip' }
                ]
            },
            {
                title: 'Expert Interviews',
                description: 'Interviews with subject matter experts',
                links: [
                    { text: 'Watch on YouTube', url: 'https://youtube.com/playlist?list=JKL012' },
                    { text: 'Download Videos', url: 'https://example.com/videos/interviews.zip' }
                ]
            }
        ]
    },
    books: {
        title: 'Reference Books',
        icon: 'fas fa-book',
        description: 'Recommended textbooks and guides',
        resources: [
            {
                title: 'Textbooks',
                description: 'Recommended textbooks for in-depth study',
                links: [
                    { text: 'View Online', url: 'https://example.com/books/textbook1' },
                    { text: 'Download PDF', url: 'https://example.com/books/textbook1.pdf' }
                ]
            },
            {
                title: 'Reference Books',
                description: 'Additional reference books for advanced learning',
                links: [
                    { text: 'View Online', url: 'https://example.com/books/reference1' },
                    { text: 'Download PDF', url: 'https://example.com/books/reference1.pdf' }
                ]
            },
            {
                title: 'Solution Manuals',
                description: 'Step-by-step solutions to textbook problems',
                links: [
                    { text: 'View Online', url: 'https://example.com/books/solutions' },
                    { text: 'Download PDF', url: 'https://example.com/books/solutions.pdf' }
                ]
            },
            {
                title: 'Study Guides',
                description: 'Guides for exam preparation and quick revision',
                links: [
                    { text: 'View Online', url: 'https://example.com/books/study-guide' },
                    { text: 'Download PDF', url: 'https://example.com/books/study-guide.pdf' }
                ]
            }
        ]
    }
};

// App state
let currentView = 'streamSelection';
let selectedStream = null;
let selectedSubject = null;
let selectedMaterialType = null;

// DOM Elements
const views = {
    streamSelection: document.getElementById('streamSelection'),
    streamDashboard: document.getElementById('streamDashboard'),
    subjectMaterials: document.getElementById('subjectMaterials'),
    materialDetail: document.getElementById('materialDetail')
};

const headerElements = {
    title: document.getElementById('headerTitle'),
    subtitle: document.getElementById('headerSubtitle'),
    backBtn: document.getElementById('backBtn')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showView('streamSelection');
});

// Set up event listeners
function initializeEventListeners() {
    // Stream selection cards
    document.querySelectorAll('.stream-card').forEach(card => {
        card.addEventListener('click', function() {
            const streamId = this.dataset.stream;
            selectStream(streamId);
        });
    });

    // Back button
    headerElements.backBtn.addEventListener('click', handleBack);
}

// View management
function showView(viewName) {
    // Hide all views
    Object.values(views).forEach(view => {
        view.classList.remove('active');
    });
    
    // Show the selected view
    views[viewName].classList.add('active');
    currentView = viewName;
    
    // Update header
    updateHeader();
}

// Stream selection
function selectStream(streamId) {
    selectedStream = streamsData[streamId];
    if (selectedStream) {
        populateStreamDashboard();
        showView('streamDashboard');
    }
}

// Subject selection
function selectSubject(subjectId) {
    if (selectedStream) {
        selectedSubject = selectedStream.subjects.find(s => s.id === subjectId);
        if (selectedSubject) {
            populateSubjectMaterials();
            showView('subjectMaterials');
        }
    }
}

// Material type selection
function selectMaterialType(type) {
    if (selectedSubject && selectedStream) {
        selectedMaterialType = type;
        populateMaterialDetail();
        showView('materialDetail');
    }
}

// Back navigation
function handleBack() {
    if (currentView === 'materialDetail') {
        showView('subjectMaterials');
        selectedMaterialType = null;
    } else if (currentView === 'subjectMaterials') {
        showView('streamDashboard');
        selectedSubject = null;
    } else if (currentView === 'streamDashboard') {
        showView('streamSelection');
        selectedStream = null;
    }
}

// Populate stream dashboard
function populateStreamDashboard() {
    if (!selectedStream) return;

    // Update header info
    document.getElementById('streamTitle').innerHTML = 
        `${selectedStream.name} <span class="gradient-text">Dashboard</span>`;
    document.getElementById('streamDescription').textContent = selectedStream.description;

    // Calculate total materials
    const totalMaterials = selectedStream.subjects.reduce((total, subject) => {
        return total + subject.materials.notes + subject.materials.tests + 
               subject.materials.videos + subject.materials.books;
    }, 0);

    document.getElementById('subjectCount').textContent = selectedStream.subjects.length;
    document.getElementById('materialCount').textContent = totalMaterials;

    // Populate subjects grid
    const subjectsGrid = document.getElementById('subjectsGrid');
    subjectsGrid.innerHTML = '';

    selectedStream.subjects.forEach(subject => {
        const subjectCard = createSubjectCard(subject, selectedStream.color);
        subjectsGrid.appendChild(subjectCard);
    });
}

// Populate subject materials
function populateSubjectMaterials() {
    if (!selectedSubject || !selectedStream) return;

    // Update header info
    document.getElementById('subjectTitle').innerHTML = 
        `${selectedSubject.name} <span class="gradient-text">Materials</span>`;
    document.getElementById('subjectDescription').textContent = selectedSubject.description;
    document.getElementById('currentStream').textContent = selectedStream.name;
    document.getElementById('tipsSubject').textContent = selectedSubject.name;

    // Populate materials grid
    const materialsGrid = document.getElementById('materialsGrid');
    materialsGrid.innerHTML = '';

    Object.entries(materialTypes).forEach(([type, info]) => {
        const count = selectedSubject.materials[type];
        const materialCard = createMaterialCard(type, info, count, selectedStream.color);
        materialsGrid.appendChild(materialCard);
    });
}

// Populate material detail view
function populateMaterialDetail() {
    if (!selectedMaterialType || !selectedSubject || !selectedStream) return;

    const materialInfo = materialTypes[selectedMaterialType];
    
    // Update header info
    document.getElementById('materialTypeTitle').textContent = 
        `${selectedSubject.name} ${materialInfo.title}`;
    document.getElementById('materialTypeSubtitle').textContent = materialInfo.description;
    document.getElementById('tipsMaterialType').textContent = materialInfo.title;

    // Populate resources grid
    const resourcesGrid = document.getElementById('resourcesGrid');
    resourcesGrid.innerHTML = '';

    materialInfo.resources.forEach((resource, index) => {
        const resourceCard = createResourceCard(resource, selectedStream.color, index);
        resourcesGrid.appendChild(resourceCard);
    });
}

// Create subject card element
function createSubjectCard(subject, streamColor) {
    const card = document.createElement('div');
    card.className = `subject-card ${streamColor}`;
    card.addEventListener('click', () => selectSubject(subject.id));

    card.innerHTML = `
        <div class="subject-header">
            <div class="subject-icon ${streamColor}">
                <i class="${subject.icon}"></i>
            </div>
            <div class="subject-info">
                <h3 class="subject-name">${subject.name}</h3>
                <p class="subject-description">${subject.description}</p>
            </div>
        </div>
        <div class="subject-materials">
            <div class="material-stat">
                <span class="material-label">Notes</span>
                <span class="material-count">${subject.materials.notes}</span>
            </div>
            <div class="material-stat">
                <span class="material-label">Tests</span>
                <span class="material-count">${subject.materials.tests}</span>
            </div>
            <div class="material-stat">
                <span class="material-label">Videos</span>
                <span class="material-count">${subject.materials.videos}</span>
            </div>
            <div class="material-stat">
                <span class="material-label">Books</span>
                <span class="material-count">${subject.materials.books}</span>
            </div>
        </div>
    `;

    return card;
}

// Create material card element
function createMaterialCard(type, info, count, streamColor) {
    const card = document.createElement('div');
    card.className = `material-card ${streamColor}`;
    card.addEventListener('click', () => selectMaterialType(type));

    card.innerHTML = `
        <div class="material-icon ${streamColor}">
            <i class="${info.icon}"></i>
        </div>
        <h3 class="material-title">${info.title}</h3>
        <div class="material-count">${count}</div>
        <div class="material-label">Available</div>
    `;

    return card;
}

// Create resource card element
function createResourceCard(resource, streamColor, index) {
    const card = document.createElement('div');
    card.className = `resource-card ${streamColor}`;

    let linksHTML = '';
    resource.links.forEach(link => {
        linksHTML += `<a href="${link.url}" class="resource-link ${streamColor}" target="_blank">${link.text}</a> `;
    });

    card.innerHTML = `
        <h3 class="resource-title">${resource.title}</h3>
        <p class="resource-description">${resource.description}</p>
        <div class="resource-links">
            ${linksHTML}
        </div>
    `;

    return card;
}

// Update header based on current view
function updateHeader() {
    const headerConfig = getHeaderConfig();
    
    headerElements.title.textContent = headerConfig.title;
    headerElements.subtitle.textContent = headerConfig.subtitle || '';
    
    if (headerConfig.showBackButton) {
        headerElements.backBtn.classList.remove('hidden');
    } else {
        headerElements.backBtn.classList.add('hidden');
    }
}

// Get header configuration based on current view
function getHeaderConfig() {
    switch (currentView) {
        case 'streamSelection':
            return {
                title: 'StudyHub',
                subtitle: 'Your Academic Success Partner'
            };
        case 'streamDashboard':
            return {
                title: selectedStream?.name || '',
                subtitle: 'Select a subject to access study materials',
                showBackButton: true
            };
        case 'subjectMaterials':
            return {
                title: selectedSubject?.name || '',
                subtitle: `${selectedStream?.name} • Study Materials`,
                showBackButton: true
            };
        case 'materialDetail':
            return {
                title: materialTypes[selectedMaterialType]?.title || '',
                subtitle: `${selectedSubject?.name} • ${selectedStream?.name}`,
                showBackButton: true
            };
        default:
            return { title: 'StudyHub' };
    }
}
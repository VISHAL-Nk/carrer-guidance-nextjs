"use client";

import { useMemo, useState } from "react";

// Data for the application (ported from script.js)
const streamsData = {
	science: {
		id: "science",
		name: "Science (PCM/PCB)",
		description:
			"Physics, Chemistry, Mathematics/Biology stream for engineering and medical aspirants",
		color: "blue",
		subjects: [
			{
				id: "physics",
				name: "Physics",
				description: "Mechanics, Thermodynamics, Optics, and Modern Physics",
				icon: "fas fa-atom",
				materials: { notes: 10, tests: 10, videos: 10, books: 12 },
			},
			{
				id: "chemistry",
				name: "Chemistry",
				description: "Organic, Inorganic, and Physical Chemistry",
				icon: "fas fa-flask",
				materials: { notes: 10, tests: 10, videos: 12, books: 10 },
			},
			{
				id: "mathematics",
				name: "Mathematics",
				description: "Calculus, Algebra, Coordinate Geometry, and Trigonometry",
				icon: "fas fa-calculator",
				materials: { notes: 12, tests: 10, videos: 21, books: 8 },
			},
			{
				id: "biology",
				name: "Biology",
				description: "Botany, Zoology, and Human Physiology",
				icon: "fas fa-leaf",
				materials: { notes: 10, tests: 15, videos: 10, books: 5 },
			},
		],
	},
	commerce: {
		id: "commerce",
		name: "Commerce",
		description:
			"Business Studies, Economics, and Accountancy for future entrepreneurs",
		color: "green",
		subjects: [
			{
				id: "accountancy",
				name: "Accountancy",
				description: "Financial Accounting, Cost Accounting, and Company Accounts",
				icon: "fas fa-calculator",
				materials: { notes: 5, tests: 10, videos: 18, books: 12 },
			},
			{
				id: "business-studies",
				name: "Business Studies",
				description: "Management, Marketing, and Business Environment",
				icon: "fas fa-briefcase",
				materials: { notes: 12, tests: 18, videos: 15, books: 10 },
			},
			{
				id: "economics",
				name: "Economics",
				description:
					"Microeconomics, Macroeconomics, and Indian Economic Development",
				icon: "fas fa-chart-line",
				materials: { notes: 18, tests: 12, videos: 10, books: 4 },
			},
			{
				id: "english",
				name: "English",
				description: "Literature, Grammar, and Business Communication",
				icon: "fas fa-book-open",
				materials: { notes: 10, tests: 15, videos: 12, books: 18 },
			},
		],
	},
	arts: {
		id: "arts",
		name: "Arts/Humanities",
		description:
			"History, Political Science, and Literature for creative minds",
		color: "purple",
		subjects: [
			{
				id: "history",
				name: "History",
				description: "Ancient, Medieval, and Modern History of India and World",
				icon: "fas fa-clock",
				materials: { notes: 15, tests: 10, videos: 12, books: 10 },
			},
			{
				id: "political-science",
				name: "Political Science",
				description:
					"Indian Constitution, Political Theory, and International Relations",
				icon: "fas fa-users",
				materials: { notes: 10, tests: 15, videos: 14, books: 6 },
			},
			{
				id: "geography",
				name: "Geography",
				description: "Physical Geography, Human Geography, and Map Work",
				icon: "fas fa-globe",
				materials: { notes: 15, tests: 18, videos: 5, books: 2 },
			},
			{
				id: "psychology",
				name: "Psychology",
				description:
					"General Psychology, Social Psychology, and Research Methods",
				icon: "fas fa-brain",
				materials: { notes: 12, tests: 2, videos: 5, books: 8 },
			},
		],
	},
};

const materialTypes = {
	notes: {
		title: "Study Notes",
		icon: "fas fa-file-alt",
		description: "Comprehensive notes and summaries",
		resources: [
			{
				title: "Chapter-wise Notes",
				description:
					"Detailed notes for each chapter with important concepts highlighted",
				links: [
					{
						text: "Download PDF",
						url: "https://ncert.nic.in/textbook/pdf/keph1dd.zip",
					},
					{
						text: "View Online",
						url: "https://ncert.nic.in/textbook.php?keph1=0-7",
					},
				],
			},
			{
				title: "Revision Notes",
				description: "Quick revision notes for last-minute preparation",
				links: [
					{
						text: "Download PDF",
						url:
							"https://drive.google.com/folderview?id=10B_vUSjgUSwwy1LQrxrZHKc6AqmTcFcT",
					},
					{
						text: "View Online",
						url: "https://www.raiedu.in/p/ncert-note.html",
					},
				],
			},
			{
				title: "Formula Sheets",
				description: "All important formulas compiled in one place",
				links: [
					{
						text: "Download PDF",
						url: "https://www.mathongo.com/dw/formula-sheets/?subject=Physics",
					},
					{
						text: "View Online",
						url: "https://www.concepts-of-physics.com/pdf/physics-formulas.pdf",
					},
				],
			},
			{
				title: "Important Questions",
				description: "Most frequently asked questions in exams",
				links: [
					{
						text: "Download PDF",
						url: "https://example.com/notes/important-questions.pdf",
					},
					{
						text: "View Online",
						url:
							"https://www.selfstudys.com/books/cbse-important-questions/english/11th/physics/49819#google_vignette",
					},
				],
			},
		],
	},
	tests: {
		title: "Practice Tests",
		icon: "fas fa-vial",
		description: "Mock tests and practice papers",
		resources: [
			{
				title: "Chapter-wise Tests",
				description: "Tests for each chapter to check your understanding",
				links: [
					{
						text: "Take Test Online",
						url: "https://test.sanfoundry.com/class-11-physics-tests/",
					},
					{ text: "Download PDF", url: "https://example.com/tests/chapter1.pdf" },
				],
			},
			{
				title: "Previous Year Papers",
				description: "Previous year question papers with solutions",
				links: [
					{ text: "View Solutions", url: "https://example.com/tests/previous-year" },
					{
						text: "Download Papers",
						url: "https://ncert.nic.in/pdf/publication/exemplarproblem/classXI/physics/keep317.pdf",
					},
				],
			},
			{
				title: "Mock Exams",
				description: "Full-length mock exams simulating real test conditions",
				links: [
					{ text: "Take Mock Test", url: "https://example.com/tests/mock-exam" },
					{ text: "Download Answer Key", url: "https://example.com/tests/answer-key.pdf" },
				],
			},
			{
				title: "Topic-wise Quizzes",
				description: "Short quizzes for specific topics",
				links: [
					{ text: "Take Quiz", url: "https://example.com/tests/quiz1" },
					{ text: "Download Questions", url: "https://example.com/tests/quiz1.pdf" },
				],
			},
		],
	},
	videos: {
		title: "Video Lectures",
		icon: "fas fa-play",
		description: "Educational video content",
		resources: [
			{
				title: "Concept Videos",
				description: "Detailed explanations of important concepts",
				links: [
					{ text: "Watch on YouTube", url: "https://youtube.com/playlist?list=ABC123" },
					{ text: "Download Videos", url: "https://example.com/videos/concepts.zip" },
				],
			},
			{
				title: "Problem Solving",
				description: "Step-by-step solutions to problems",
				links: [
					{ text: "Watch on YouTube", url: "https://youtube.com/playlist?list=DEF456" },
					{ text: "Download Videos", url: "https://example.com/videos/problems.zip" },
				],
			},
			{
				title: "Revision Videos",
				description: "Quick revision of entire chapters",
				links: [
					{ text: "Watch on YouTube", url: "https://youtube.com/playlist?list=GHI789" },
					{ text: "Download Videos", url: "https://example.com/videos/revision.zip" },
				],
			},
			{
				title: "Expert Interviews",
				description: "Interviews with subject matter experts",
				links: [
					{ text: "Watch on YouTube", url: "https://youtube.com/playlist?list=JKL012" },
					{ text: "Download Videos", url: "https://example.com/videos/interviews.zip" },
				],
			},
		],
	},
	books: {
		title: "Reference Books",
		icon: "fas fa-book",
		description: "Recommended textbooks and guides",
		resources: [
			{
				title: "Textbooks",
				description: "Recommended textbooks for in-depth study",
				links: [
					{ text: "View Online", url: "https://example.com/books/textbook1" },
					{ text: "Download PDF", url: "https://example.com/books/textbook1.pdf" },
				],
			},
			{
				title: "Reference Books",
				description: "Additional reference books for advanced learning",
				links: [
					{ text: "View Online", url: "https://example.com/books/reference1" },
					{ text: "Download PDF", url: "https://example.com/books/reference1.pdf" },
				],
			},
			{
				title: "Solution Manuals",
				description: "Step-by-step solutions to textbook problems",
				links: [
					{ text: "View Online", url: "https://example.com/books/solutions" },
					{ text: "Download PDF", url: "https://example.com/books/solutions.pdf" },
				],
			},
			{
				title: "Study Guides",
				description: "Guides for exam preparation and quick revision",
				links: [
					{ text: "View Online", url: "https://example.com/books/study-guide" },
					{ text: "Download PDF", url: "https://example.com/books/study-guide.pdf" },
				],
			},
		],
	},
};

function sumMaterials(subjects) {
	return subjects.reduce(
		(acc, s) => acc + (s.materials?.notes || 0) + (s.materials?.tests || 0) + (s.materials?.videos || 0) + (s.materials?.books || 0),
		0
	);
}

export default function StudyMaterialsPage() {
	const [currentView, setCurrentView] = useState("streamSelection");
	const [selectedStreamId, setSelectedStreamId] = useState(null);
	const [selectedSubjectId, setSelectedSubjectId] = useState(null);
	const [selectedMaterialType, setSelectedMaterialType] = useState(null);

    // History for back/forward navigation
    const [history, setHistory] = useState([{ view: "streamSelection", streamId: null, subjectId: null, materialType: null }]);
    const [historyIndex, setHistoryIndex] = useState(0);

	const selectedStream = selectedStreamId ? streamsData[selectedStreamId] : null;
	const selectedSubject = useMemo(() => {
		if (!selectedStream || !selectedSubjectId) return null;
		return selectedStream.subjects.find((s) => s.id === selectedSubjectId) || null;
	}, [selectedStream, selectedSubjectId]);

	const materialSpec = selectedMaterialType ? materialTypes[selectedMaterialType] : null;

	const header = useMemo(() => {
		switch (currentView) {
			case "streamDashboard":
				return {
					title: "StudyHub",
					subtitle: selectedStream ? `${selectedStream.name} Dashboard` : "Dashboard",
					showBack: true,
				};
			case "subjectMaterials":
				return {
					title: "StudyHub",
					subtitle: selectedSubject ? `${selectedSubject.name} Materials` : "Materials",
					showBack: true,
				};
			case "materialDetail":
				return {
					title: "StudyHub",
					subtitle: materialSpec ? materialSpec.title : "Details",
					showBack: true,
				};
			default:
				return {
					title: "StudyHub",
					subtitle: "Your Academic Success Partner",
					showBack: false,
				};
		}
	}, [currentView, selectedStream, selectedSubject, materialSpec]);

		// Centralized navigation
		const setFromEntry = (entry) => {
			setCurrentView(entry.view);
			setSelectedStreamId(entry.streamId ?? null);
			setSelectedSubjectId(entry.subjectId ?? null);
			setSelectedMaterialType(entry.materialType ?? null);
		};

		const navigateTo = (view, streamId = selectedStreamId, subjectId = selectedSubjectId, materialType = selectedMaterialType) => {
			const entry = { view, streamId: streamId ?? null, subjectId: subjectId ?? null, materialType: materialType ?? null };
			setFromEntry(entry);
			setHistory((prev) => {
				const trimmed = prev.slice(0, historyIndex + 1);
				return [...trimmed, entry];
			});
			setHistoryIndex(historyIndex + 1);
		};

		const onSelectStream = (id) => {
			navigateTo("streamDashboard", id, null, null);
		};

		const onSelectSubject = (id) => {
			navigateTo("subjectMaterials", selectedStreamId, id, null);
		};

		const onSelectMaterialType = (type) => {
			navigateTo("materialDetail", selectedStreamId, selectedSubjectId, type);
		};

		const onBack = () => {
			if (historyIndex > 0) {
				const newIndex = historyIndex - 1;
				setHistoryIndex(newIndex);
				setFromEntry(history[newIndex]);
			}
		};

		const onForward = () => {
			if (historyIndex < history.length - 1) {
				const newIndex = historyIndex + 1;
				setHistoryIndex(newIndex);
				setFromEntry(history[newIndex]);
			}
		};

	const materialTotal = selectedStream ? sumMaterials(selectedStream.subjects) : 0;

		return (
			<div className="studyhub">
					{/* Navigation bar with Back/Forward and breadcrumbs */}
					<div className="container" style={{ paddingTop: "1rem" }}>
						<div className="nav-bar">
							<div className="nav-controls">
								<button
									className={`nav-btn ${historyIndex === 0 ? "disabled" : ""}`}
									onClick={onBack}
									aria-label="Go back"
									disabled={historyIndex === 0}
								>
									<i className="fas fa-arrow-left" />
								</button>
								<button
									className={`nav-btn ${historyIndex >= history.length - 1 ? "disabled" : ""}`}
									onClick={onForward}
									aria-label="Go forward"
									disabled={historyIndex >= history.length - 1}
								>
									<i className="fas fa-arrow-right" />
								</button>
								<button
									className="nav-btn"
									aria-label="Go to start"
									onClick={() => navigateTo("streamSelection", null, null, null)}
								>
									<i className="fas fa-home" />
								</button>
							</div>
							<div className="breadcrumbs">
								<span className={`crumb ${currentView === "streamSelection" ? "active" : ""}`}>Streams</span>
								{selectedStream && <>
									<i className="fas fa-angle-right sep" />
									<span className={`crumb ${currentView !== "streamSelection" && currentView !== "streamDashboard" ? "" : "active"}`}>{selectedStream.name}</span>
								</>}
								{selectedSubject && <>
									<i className="fas fa-angle-right sep" />
									<span className={`crumb ${currentView === "subjectMaterials" ? "active" : ""}`}>{selectedSubject.name}</span>
								</>}
								{materialSpec && <>
									<i className="fas fa-angle-right sep" />
									<span className="crumb active">{materialSpec.title}</span>
								</>}
							</div>
						</div>
					</div>

				{/* Main Content */}
				<main id="mainContent">
				{/* Stream Selection View */}
				<div
					id="streamSelection"
					className={`view ${currentView === "streamSelection" ? "active" : ""}`}
				>
					<div className="container">
						<div className="hero-section">
							<h1 className="hero-title">
								Choose Your <span className="gradient-text">Stream</span>
							</h1>
							<p className="hero-description">
								Select your academic stream to access comprehensive study materials, practice tests, and resources
								tailored for Class 11 &amp; 12 students.
							</p>
						</div>

						<div className="streams-grid">
							{Object.values(streamsData).map((stream) => (
								<div
									key={stream.id}
									className={`stream-card ${stream.color}`}
									role="button"
									tabIndex={0}
									onClick={() => onSelectStream(stream.id)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") onSelectStream(stream.id);
									}}
									data-stream={stream.id}
								>
									<div className="stream-content">
										<h3 className="stream-title">{stream.name}</h3>
										<p className="stream-description">{stream.description}</p>
										<div className="stream-stats">
											<div className="stat">{stream.subjects.length} Subjects</div>
											<div className="stat">Study Materials</div>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="features">
							<div className="feature">
								<div className="feature-dot green" />
								<span>Updated Content</span>
							</div>
							<div className="feature">
								<div className="feature-dot blue" />
								<span>Expert Curated</span>
							</div>
							<div className="feature">
								<div className="feature-dot purple" />
								<span>Exam Focused</span>
							</div>
						</div>
					</div>
				</div>

				{/* Stream Dashboard View */}
				<div
					id="streamDashboard"
					className={`view ${currentView === "streamDashboard" ? "active" : ""}`}
				>
					<div className="container">
						<div className="dashboard-header">
							<h1 id="streamTitle" className="dashboard-title">
								<span className="gradient-text">Dashboard</span>
							</h1>
							<p id="streamDescription" className="dashboard-description">
								{selectedStream?.description || ""}
							</p>

							<div className="dashboard-stats">
								<div className="stat-item">
									<div className="stat-number" id="subjectCount">
										{selectedStream?.subjects.length || 0}
									</div>
									<div className="stat-label">Subjects</div>
								</div>
								<div className="stat-divider" />
								<div className="stat-item">
									<div className="stat-number" id="materialCount">
										{materialTotal}
									</div>
									<div className="stat-label">Study Materials</div>
								</div>
								<div className="stat-divider" />
								<div className="stat-item">
									<div className="stat-number">24/7</div>
									<div className="stat-label">Access</div>
								</div>
							</div>
						</div>

						<div id="subjectsGrid" className="subjects-grid">
							{selectedStream?.subjects.map((subj) => (
								<div
									key={subj.id}
									className={`subject-card ${selectedStream.color}`}
									role="button"
									tabIndex={0}
									onClick={() => onSelectSubject(subj.id)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") onSelectSubject(subj.id);
									}}
								>
									<div className="subject-header">
										<div className={`subject-icon ${selectedStream.color}`}>
											<i className={subj.icon} />
										</div>
										<div className="subject-info">
											<div className="subject-name">{subj.name}</div>
											<div className="subject-description">{subj.description}</div>
										</div>
									</div>
									<div className="subject-materials">
										<div className="material-stat">
											<span className="material-label">Notes</span>
											<span className="material-count">{subj.materials.notes}</span>
										</div>
										<div className="material-stat">
											<span className="material-label">Tests</span>
											<span className="material-count">{subj.materials.tests}</span>
										</div>
										<div className="material-stat">
											<span className="material-label">Videos</span>
											<span className="material-count">{subj.materials.videos}</span>
										</div>
										<div className="material-stat">
											<span className="material-label">Books</span>
											<span className="material-count">{subj.materials.books}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Subject Materials View */}
				<div
					id="subjectMaterials"
					className={`view ${currentView === "subjectMaterials" ? "active" : ""}`}
				>
					<div className="container">
						<div className="materials-header">
							<h1 id="subjectTitle" className="materials-title">
								<span className="gradient-text">Materials</span>
							</h1>
							<p id="subjectDescription" className="materials-description">
								{selectedSubject?.description || ""}
							</p>

							<div className="stream-badge">
								<span className="badge-label">Stream:</span>
								<span id="currentStream" className="badge-value">
									{selectedStream?.name || ""}
								</span>
							</div>
						</div>

						<div id="materialsGrid" className="materials-grid">
							{selectedSubject && (
								<>
									{(["notes", "tests", "videos", "books"]).map((typeKey) => (
										<div
											key={typeKey}
											className={`material-card ${selectedStream.color}`}
											role="button"
											tabIndex={0}
											onClick={() => onSelectMaterialType(typeKey)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") onSelectMaterialType(typeKey);
											}}
										>
											<div className={`material-icon ${selectedStream.color}`}>
												<i className={materialTypes[typeKey].icon} />
											</div>
											<div className="material-title">{materialTypes[typeKey].title}</div>
											<div className="material-count">
												{selectedSubject.materials[typeKey]}
											</div>
											<div className="material-label">Available</div>
										</div>
									))}
								</>
							)}
						</div>

						<div className="tips-section">
							<h2 className="tips-title">
								Quick Tips for <span id="tipsSubject">{selectedSubject?.name || "Subject"}</span>
							</h2>
							<div className="tips-grid">
								<div className="tips-column">
									<div className="tip">
										<div className="tip-dot blue" />
										<p>Start with basic concepts and build your foundation</p>
									</div>
									<div className="tip">
										<div className="tip-dot green" />
										<p>Practice regularly with mock tests and previous year papers</p>
									</div>
									<div className="tip">
										<div className="tip-dot purple" />
										<p>Watch video lectures for better understanding of complex topics</p>
									</div>
								</div>
								<div className="tips-column">
									<div className="tip">
										<div className="tip-dot orange" />
										<p>Refer to recommended books for in-depth knowledge</p>
									</div>
									<div className="tip">
										<div className="tip-dot red" />
										<p>Create revision notes and practice diagrams regularly</p>
									</div>
									<div className="tip">
										<div className="tip-dot teal" />
										<p>Join study groups and discuss doubts with peers</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Material Detail View */}
				<div
					id="materialDetail"
					className={`view ${currentView === "materialDetail" ? "active" : ""}`}
				>
					<div className="container">
						<div className="material-detail">
							<div className="material-detail-header">
								<h1 id="materialTypeTitle" className="material-detail-title">
									{materialSpec?.title || ""}
								</h1>
								<p id="materialTypeSubtitle" className="material-detail-subtitle">
									{materialSpec?.description || ""}
								</p>
							</div>

							<div id="resourcesGrid" className="resources-grid">
								{materialSpec?.resources.map((res, idx) => (
									<div
										key={idx}
										className={`resource-card ${selectedStream?.color || ""}`}
									>
										<div className="resource-title">{res.title}</div>
										<div className="resource-description">{res.description}</div>
										<div>
											{res.links.map((link, i) => (
												<a
													key={i}
													className={`resource-link ${selectedStream?.color || ""}`}
													href={link.url}
													target="_blank"
													rel="noreferrer noopener"
												>
													{link.text}
												</a>
											))}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="tips-section">
							<h2 className="tips-title">
								How to Make the Most of These <span id="tipsMaterialType">{materialSpec?.title || "Materials"}</span>
							</h2>
							<div className="tips-grid">
								<div className="tips-column">
									<div className="tip">
										<div className="tip-dot blue" />
										<p>Set aside dedicated time for studying these materials</p>
									</div>
									<div className="tip">
										<div className="tip-dot green" />
										<p>Take notes while going through the resources</p>
									</div>
									<div className="tip">
										<div className="tip-dot purple" />
										<p>Review difficult concepts multiple times</p>
									</div>
								</div>
								<div className="tips-column">
									<div className="tip">
										<div className="tip-dot orange" />
										<p>Test yourself after studying each section</p>
									</div>
									<div className="tip">
										<div className="tip-dot red" />
										<p>Discuss with peers or teachers if you have questions</p>
									</div>
									<div className="tip">
										<div className="tip-dot teal" />
										<p>Create a study schedule and stick to it</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			</div>
	);
}


// ==========================================
// SCAMSHIELD - FRONTEND LOGIC
// ==========================================

// DOM Elements
const jobText = document.getElementById("jobText");
const analyzeBtn = document.getElementById("analyzeBtn");
const demoBtn = document.getElementById("demoBtn");
const resultDiv = document.getElementById("result");
const charCount = document.getElementById("charCount");


// ==========================================
// CHARACTER COUNTER
// ==========================================

jobText.addEventListener("input", function () {
    charCount.textContent = `${jobText.value.length} / 10000`;
});


// ==========================================
// SAMPLE JOB POSTING
// ==========================================

demoBtn.addEventListener("click", function () {

    const sampleJob = `URGENT HIRING - WORK FROM HOME!!!

We are hiring Data Entry Operators immediately.
Earn $800 per day working only 2 hours.

No experience required.
No interview required.
No degree required.

Pay a refundable registration fee of $35 to activate your account.
Limited vacancies! Apply immediately to secure your position.

Contact our recruiter through WhatsApp for instant selection.

`;

    jobText.value = sampleJob;
    charCount.textContent = `${sampleJob.length} / 10000`;

    resultDiv.innerHTML = "";

    jobText.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});


// ==========================================
// HELPER - WAIT
// ==========================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// ==========================================
// SCANNING ANIMATION
// ==========================================

async function showScanningAnimation() {

    resultDiv.innerHTML = `
        <div class="scanning-card">

            <div class="scanning-icon">✦</div>

            <h3>Analyzing Job Posting</h3>

            <p id="scanMessage">
                Initializing machine learning analysis...
            </p>

            <div class="scan-progress">
                <div class="scan-progress-fill" id="scanProgress"></div>
            </div>

            <div class="scan-steps">
                <span class="scan-step">Text Analysis</span>
                <span class="scan-step">Feature Processing</span>
                <span class="scan-step">ML Prediction</span>
                <span class="scan-step">Risk Assessment</span>
            </div>

        </div>
    `;

    const messages = [
        "Processing job description...",
        "Analyzing textual patterns...",
        "Evaluating ML features...",
        "Generating risk assessment..."
    ];

    const steps = document.querySelectorAll(".scan-step");
    const progress = document.getElementById("scanProgress");
    const scanMessage = document.getElementById("scanMessage");

    for (let i = 0; i < messages.length; i++) {

        scanMessage.textContent = messages[i];

        progress.style.width = `${(i + 1) * 25}%`;

        steps.forEach((step, index) => {

            step.classList.remove("active", "done");

            if (index < i) {
                step.classList.add("done");
            }

            if (index === i) {
                step.classList.add("active");
            }

        });

        await sleep(550);
    }

    steps.forEach(step => {
        step.classList.remove("active");
        step.classList.add("done");
    });
}


// ==========================================
// ANALYZE BUTTON
// ==========================================

analyzeBtn.addEventListener("click", analyzeJob);


async function analyzeJob() {

    const text = jobText.value.trim();

    // Empty input validation
    if (!text) {

        resultDiv.innerHTML = `
            <div class="error-card">
                ⚠ Please paste a job description before starting analysis.
            </div>
        `;

        jobText.focus();
        return;
    }

    // Disable button
    analyzeBtn.disabled = true;

    analyzeBtn.innerHTML = `
        <span class="btn-icon">◌</span>
        Analyzing...
    `;

    let scanningPromise;

    try {

        // Start scanning animation
        scanningPromise = showScanningAnimation();

        // API REQUEST
        const response = await fetch("http://127.0.0.1:8000/predict", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text,
                required_education: "Unknown",
                required_experience: "Unknown",
                function: "Unknown",
                industry: "Unknown",
                employment_type: "Unknown",
                telecommuting: 0,
                has_questions: 0,
                has_company_logo: 0
            })

        });

        // Wait for scan animation
        await scanningPromise;

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Validate response
        if (
            data.fraud_probability === undefined ||
            data.fraud_percentage === undefined ||
            data.prediction === undefined
        ) {
            throw new Error("Invalid response received from API.");
        }

        // Display results
        displayResult(data);

    } catch (error) {

        // Ensure scan animation finishes
        if (scanningPromise) {
            await scanningPromise;
        }

        console.error("ScamShield Error:", error);

        resultDiv.innerHTML = `
            <div class="error-card">
                <strong>Unable to analyze the job posting.</strong>

                <p style="margin-top:8px;">
                    Make sure the ScamShield backend is running
                    and try again.
                </p>

                <p style="margin-top:8px;">
                    Backend: http://127.0.0.1:8000
                </p>

                <p style="margin-top:8px;">
                    Error: ${escapeHTML(error.message)}
                </p>
            </div>
        `;

    } finally {

        // Re-enable button
        analyzeBtn.disabled = false;

        analyzeBtn.innerHTML = `
            <span class="btn-icon">✦</span>
            Analyze Job Posting
            <span class="btn-arrow">→</span>
        `;
    }
}


// ==========================================
// ADVANCED RESULTS DASHBOARD
// ==========================================

function displayResult(data) {

    const fraudPercentage = Number(data.fraud_percentage);
    const riskLevel = data.risk_level || "Unknown";
    const prediction = Number(data.prediction);
    const resultText = data.result || "Analysis Completed";

    // Safely handle score
    const safeScore = Number.isFinite(fraudPercentage)
        ? Math.max(0, Math.min(100, fraudPercentage))
        : 0;

    // Risk CSS class
    const riskClass = riskLevel
        .toLowerCase()
        .replace(/\s+/g, "-");

    // Risk description
    let riskDescription;

    if (riskLevel === "Low") {

        riskDescription =
            "The model detected relatively few fraud-associated patterns. " +
            "Still verify the employer and job details before applying.";

    } else if (riskLevel === "Moderate") {

        riskDescription =
            "Some suspicious characteristics may be present. " +
            "Review the posting carefully before proceeding.";

    } else if (riskLevel === "High") {

        riskDescription =
            "The model detected stronger patterns associated with " +
            "potential recruitment fraud. Proceed with caution.";

    } else if (riskLevel === "Very High") {

        riskDescription =
            "The model returned a high fraud score. Avoid payments " +
            "or sharing sensitive information until the employer " +
            "has been independently verified.";

    } else {

        riskDescription =
            "Review this job posting carefully and independently " +
            "verify the employer before proceeding.";
    }

    // Classification
    const predictionLabel = prediction === 1
        ? "Potentially Fraudulent"
        : "Likely Genuine";

    const resultIcon = prediction === 1 ? "⚠" : "✓";

    // ==========================================
    // RESULT HTML
    // ==========================================

    resultDiv.innerHTML = `

        <div class="final-result ${escapeHTML(riskClass)}">

            <!-- HEADER -->

            <div class="result-topline">

                <div class="report-label">

                    <div class="report-label-icon">◈</div>

                    <div>

                        <h3>Security Analysis Report</h3>

                        <p class="report-subtitle">
                            Job posting scan completed
                        </p>

                    </div>

                </div>

                <span class="result-badge ${escapeHTML(riskClass)}">
                    ${escapeHTML(riskLevel)} Risk
                </span>

            </div>


            <!-- SCORE AND CLASSIFICATION -->

            <div class="result-main">

                <div class="score-gauge-wrapper">

                    <div class="score-gauge" style="--score: 0%;">

                        <div class="gauge-content">

                            <div class="gauge-number">

                                <span id="animatedScore">0.00</span>
                                <span class="gauge-percent">%</span>

                            </div>

                            <div class="gauge-caption">
                                Fraud Score
                            </div>

                        </div>

                    </div>

                    <div class="gauge-footer">
                        Estimated fraud probability
                    </div>

                </div>


                <div class="result-summary">

                    <div class="classification-pill">

                        <span class="risk-dot"></span>

                        ${escapeHTML(predictionLabel)}

                    </div>

                    <h2>${escapeHTML(resultText)}</h2>

                    <p>${escapeHTML(riskDescription)}</p>

                </div>

            </div>


            <!-- RISK METER -->

            <div class="risk-meter-section">

                <div class="risk-meter-heading">

                    <h4>Risk Spectrum</h4>

                    <span>
                        Score: ${safeScore.toFixed(2)}%
                    </span>

                </div>


                <div class="risk-meter">

                    <div class="risk-segment"></div>
                    <div class="risk-segment"></div>
                    <div class="risk-segment"></div>
                    <div class="risk-segment"></div>

                    <div class="risk-marker" id="riskMarker"></div>

                </div>


                <div class="risk-meter-labels">

                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                    <span>Critical</span>

                </div>

            </div>


            <!-- RESULT DETAILS -->

            <div class="result-details">

                <div class="result-detail-item">

                    <span>Fraud Probability</span>

                    <strong>${safeScore.toFixed(2)}%</strong>

                </div>


                <div class="result-detail-item">

                    <span>Risk Classification</span>

                    <strong>${escapeHTML(riskLevel)}</strong>

                </div>


                <div class="result-detail-item">

                    <span>Decision Threshold</span>

                    <strong>30%</strong>

                </div>

            </div>


            <!-- MODEL EXPLANATION -->

            <div class="classification-box">

                <div class="classification-title">

                    <span>◈</span>
                    MODEL INTERPRETATION

                </div>

                <p>

                    ScamShield uses a trained Logistic Regression model
                    to analyze textual and structured job posting features.
                    The score shown above represents the model's estimated
                    fraud probability. The classification is based on the
                    project's configured decision threshold.

                </p>

            </div>


            <!-- DISCLAIMER -->

            <div class="result-disclaimer">

                <span class="disclaimer-icon">ⓘ</span>

                <p>

                    This is an automated prediction, not proof of fraud
                    or legitimacy. Always verify the company, recruiter,
                    website, and offer independently. Never pay recruitment
                    fees to secure a job.

                </p>

            </div>


            <!-- RESCAN -->

            <button class="rescan-btn" id="rescanBtn">

                ↻ Analyze Another Job

            </button>

        </div>

    `;


    // ==========================================
    // CIRCULAR GAUGE ANIMATION
    // ==========================================

    const gauge = document.querySelector(".score-gauge");
    const scoreElement = document.getElementById("animatedScore");

    let currentScore = 0;
    const duration = 1200;
    const steps = 60;
    const increment = safeScore / steps;
    const intervalTime = duration / steps;

    const scoreTimer = setInterval(() => {

        currentScore += increment;

        if (currentScore >= safeScore) {
            currentScore = safeScore;
            clearInterval(scoreTimer);
        }

        scoreElement.textContent = currentScore.toFixed(2);

        gauge.style.setProperty(
            "--score",
            `${currentScore}%`
        );

    }, intervalTime);


    // ==========================================
    // RISK MARKER ANIMATION
    // ==========================================

    const marker = document.getElementById("riskMarker");

    if (marker) {

        marker.style.left = "0%";

        setTimeout(() => {
            marker.style.left = `${safeScore}%`;
        }, 100);
    }


    // ==========================================
    // RESCAN BUTTON
    // ==========================================

    const rescanBtn = document.getElementById("rescanBtn");

    rescanBtn.addEventListener("click", function () {

        jobText.value = "";

        charCount.textContent = "0 / 10000";

        resultDiv.innerHTML = "";

        jobText.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        jobText.focus();

    });

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
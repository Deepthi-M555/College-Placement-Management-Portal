console.log("✅ builder.js loaded");

// ✅ Load injected JSON from builder.ejs safely
function getInitialResume() {
  try {
    const raw = document.getElementById("resumeDataContainer").getAttribute("data-json");
    return JSON.parse(raw);
  } catch (e) {
    console.log("JSON error:", e);
    return {
      basics: { name: "", email: "", summary: "" },
      skills: [],
      experience: [],
      projects: [],
      sections: [
        { id: "summary", name: "Summary" },
        { id: "skills", name: "Skills" },
        { id: "experience", name: "Experience" },
        { id: "projects", name: "Projects" }
      ]
    };
  }
}

let resume = getInitialResume();
console.log("✅ Initial Resume:", resume);

// ✅ Update resume object from inputs
function updateResume() {
  resume.basics = {
    name: document.getElementById("name") ? document.getElementById("name").value : "",
    email: document.getElementById("email") ? document.getElementById("email").value : "",
    summary: document.getElementById("summary").value || ""
  };

  resume.skills = (document.getElementById("skills").value || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  resume.experience = (document.getElementById("experience").value || "")
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);

  resume.projects = (document.getElementById("projects").value || "")
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);

  sendResumeToPreview();
}

// ✅ Send updated data to IFRAME preview
function sendResumeToPreview() {
  const frame = document.getElementById("previewFrame");

  if (!frame || !frame.contentWindow) {
    console.log("❌ Preview frame not ready");
    return;
  }

  frame.contentWindow.postMessage({ resume }, "*");
}

// ✅ Trigger update on typing
["summary", "skills", "experience", "projects"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", updateResume);
});

// ✅ Template change
function changeTheme(tpl) {
  const frame = document.getElementById("previewFrame");
  frame.src = `/resume/preview/temp?theme=${tpl}`;
}


// ✅ Download PDF
async function downloadPDF() {
  const res = await fetch("/resume/pdf/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume })
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  a.click();
  window.URL.revokeObjectURL(url);
}


// ✅ AI Skill Suggestion
async function analyzeText() {
  const text = document.getElementById("aiInput").value.trim();
  const box = document.getElementById("aiOutputBox");
  box.style.display = "block";
  box.innerHTML = "<em>Analyzing...</em>";

  const res = await fetch("/resume/ai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();

  let html = "";
  html += "✅ <b>Extracted Skills:</b>\n";
  html += (data.skills || []).length ? data.skills.map(s => "• " + s).join("\n") : "None";

  html += "\n\n✅ <b>Improvements:</b>\n";
  html += (data.improvements || []).map(i => "• " + i).join("\n");

  box.innerHTML = html.replace(/\n/g, "<br>");
}


// ✅ Job Match
async function jobMatch() {
  const desc = document.getElementById("jobDesc").value.trim();
  const box = document.getElementById("jobMatchBox");
  box.style.display = "block";
  box.innerHTML = "<em>Calculating...</em>";

  const res = await fetch("/resume/scoring/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jobDesc: desc })
  });

  const data = await res.json();

  box.innerHTML = `
    ✅ <b>Job Match:</b> ${data.match}%<br><br>
    <b>Covered:</b> ${data.covered?.join(", ") || "None"}<br>
    <b>Missing:</b> ${data.missing?.join(", ") || "None"}
  `;
}

function saveResume() {
  const data = document.getElementById("resumeDataContainer").dataset.json;

  fetch("/resume/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume: JSON.parse(data) })
  })
  .then(r => r.json())
  .then(res => alert(res.success ? "Saved!" : "Failed to save"));
}

function scoreResume() {
  const summaryText = document.getElementById("summary").value;

  fetch("/resume/ats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: summaryText })
  })
  .then(res => res.json())
  .then(data => {
    alert("ATS Score: " + data.score);
  });
}

// ✅ Listen for drag/drop reorder events from builder.ejs
window.addEventListener("message", (event) => {
  if (event.data.type === "reorder") {
    const newOrder = event.data.order;
    console.log("✅ New order:", newOrder);

    // Optional: update preview
    // updateResumePreview(newOrder);

    // Optional: send to server
    /*
    fetch("/resume/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder })
    });
    */
  }
});




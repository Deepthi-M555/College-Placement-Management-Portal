module.exports = function getEmptyResume() {
  return {
    basics: {
      name: "",
      email: "",
      summary: ""
    },

    skills: [],
    experience: [],
    projects: [],
    education: [],

    sections: [
      { id: "basics", name: "Basic Info" },
      { id: "summary", name: "Professional Summary" },
      { id: "skills", name: "Skills" },
      { id: "experience", name: "Experience" },
      { id: "projects", name: "Projects" },
      { id: "education", name: "Education" }
    ]
  };
};

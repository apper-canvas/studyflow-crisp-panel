import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find((a) => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async getByCourseId(courseId) {
    await delay(250);
    return assignments.filter((a) => a.courseId === parseInt(courseId));
  },

  async create(assignmentData) {
    await delay(400);
    const maxId = assignments.length > 0 ? Math.max(...assignments.map((a) => a.Id)) : 0;
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData,
      createdAt: Date.now(),
      completedAt: null
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(400);
    const index = assignments.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index] = { ...assignments[index], ...assignmentData };
    return { ...assignments[index] };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = assignments.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index].status = status;
    assignments[index].completedAt = status === "completed" ? Date.now() : null;
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(300);
    const index = assignments.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments.splice(index, 1);
    return true;
  }
};

export default assignmentService;
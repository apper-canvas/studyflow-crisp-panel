import mockData from '../mockData/students.json';

let students = [...mockData];
let nextId = Math.max(...students.map(s => s.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error('Student not found');
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    const newStudent = {
      ...studentData,
      Id: nextId++
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(400);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Student not found');
    }
    students[index] = {
      ...studentData,
      Id: parseInt(id)
    };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(300);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Student not found');
    }
    students.splice(index, 1);
    return { success: true };
  }
};

export default studentService;
import categoriesData from "@/services/mockData/gradeCategories.json";

let categories = [...categoriesData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const gradeCategoryService = {
  async getAll() {
    await delay(300);
    return [...categories];
  },

  async getById(id) {
    await delay(200);
    const category = categories.find((c) => c.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  async getByCourseId(courseId) {
    await delay(250);
    return categories.filter((c) => c.courseId === parseInt(courseId));
  },

  async create(categoryData) {
    await delay(400);
    const maxId = categories.length > 0 ? Math.max(...categories.map((c) => c.Id)) : 0;
    const newCategory = {
      Id: maxId + 1,
      ...categoryData
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(400);
    const index = categories.findIndex((c) => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    categories[index] = { ...categories[index], ...categoryData };
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(300);
    const index = categories.findIndex((c) => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    categories.splice(index, 1);
    return true;
  }
};

export default gradeCategoryService;
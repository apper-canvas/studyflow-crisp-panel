const gradeCategoryService = {
  async getAll() {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "weight_c"}},
        {"field": {"Name": "course_id_c"}}
      ]
    };

    const response = await apperClient.fetchRecords('grade_category_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  },

  async getById(id) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "weight_c"}},
        {"field": {"Name": "course_id_c"}}
      ]
    };

    const response = await apperClient.getRecordById('grade_category_c', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data;
  },

  async getByCourseId(courseId) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "weight_c"}},
        {"field": {"Name": "course_id_c"}}
      ],
      where: [
        {
          FieldName: "course_id_c",
          Operator: "EqualTo",
          Values: [parseInt(courseId)]
        }
      ]
    };

    const response = await apperClient.fetchRecords('grade_category_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  },

  async create(categoryData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: categoryData.name_c,
        name_c: categoryData.name_c,
        weight_c: parseFloat(categoryData.weight_c),
        course_id_c: parseInt(categoryData.course_id_c)
      }]
    };

    const response = await apperClient.createRecord('grade_category_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to create category:`, failed);
        throw new Error(failed[0].message || 'Failed to create category');
      }
      return response.results[0].data;
    }
  },

  async update(id, categoryData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        Name: categoryData.name_c,
        name_c: categoryData.name_c,
        weight_c: parseFloat(categoryData.weight_c),
        course_id_c: parseInt(categoryData.course_id_c)
      }]
    };

    const response = await apperClient.updateRecord('grade_category_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to update category:`, failed);
        throw new Error(failed[0].message || 'Failed to update category');
      }
      return response.results[0].data;
    }
  },

  async delete(id) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord('grade_category_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to delete category:`, failed);
        throw new Error(failed[0].message || 'Failed to delete category');
      }
      return true;
    }
  }
};

export default gradeCategoryService;
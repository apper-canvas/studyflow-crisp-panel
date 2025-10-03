const gradeService = {
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
        {"field": {"Name": "course_id_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "score_c"}},
        {"field": {"Name": "max_score_c"}},
        {"field": {"Name": "weight_c"}},
        {"field": {"Name": "date_c"}}
      ]
    };

    const response = await apperClient.fetchRecords('grade_c', params);
    
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
        {"field": {"Name": "course_id_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "score_c"}},
        {"field": {"Name": "max_score_c"}},
        {"field": {"Name": "weight_c"}},
        {"field": {"Name": "date_c"}}
      ]
    };

    const response = await apperClient.getRecordById('grade_c', parseInt(id), params);
    
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
        {"field": {"Name": "course_id_c"}},
        {"field": {"Name": "category_c"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "score_c"}},
        {"field": {"Name": "max_score_c"}},
        {"field": {"Name": "weight_c"}},
        {"field": {"Name": "date_c"}}
      ],
      where: [
        {
          FieldName: "course_id_c",
          Operator: "EqualTo",
          Values: [parseInt(courseId)]
        }
      ]
    };

    const response = await apperClient.fetchRecords('grade_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  },

  async create(gradeData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: gradeData.title_c,
        course_id_c: parseInt(gradeData.course_id_c),
        category_c: gradeData.category_c,
        title_c: gradeData.title_c,
        score_c: parseFloat(gradeData.score_c),
        max_score_c: parseFloat(gradeData.max_score_c),
        weight_c: parseFloat(gradeData.weight_c),
        date_c: new Date().toISOString()
      }]
    };

    const response = await apperClient.createRecord('grade_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to create grade:`, failed);
        throw new Error(failed[0].message || 'Failed to create grade');
      }
      return response.results[0].data;
    }
  },

  async update(id, gradeData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        Name: gradeData.title_c,
        course_id_c: parseInt(gradeData.course_id_c),
        category_c: gradeData.category_c,
        title_c: gradeData.title_c,
        score_c: parseFloat(gradeData.score_c),
        max_score_c: parseFloat(gradeData.max_score_c),
        weight_c: parseFloat(gradeData.weight_c)
      }]
    };

    const response = await apperClient.updateRecord('grade_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to update grade:`, failed);
        throw new Error(failed[0].message || 'Failed to update grade');
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

    const response = await apperClient.deleteRecord('grade_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to delete grade:`, failed);
        throw new Error(failed[0].message || 'Failed to delete grade');
      }
      return true;
    }
  }
};

export default gradeService;
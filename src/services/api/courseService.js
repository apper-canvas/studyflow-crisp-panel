const courseService = {
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
        {"field": {"Name": "course_code_c"}},
        {"field": {"Name": "instructor_c"}},
        {"field": {"Name": "schedule_c"}},
        {"field": {"Name": "credits_c"}},
        {"field": {"Name": "color_c"}},
        {"field": {"Name": "semester_c"}},
        {"field": {"Name": "created_at_c"}}
      ]
    };

    const response = await apperClient.fetchRecords('course_c', params);
    
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
        {"field": {"Name": "course_code_c"}},
        {"field": {"Name": "instructor_c"}},
        {"field": {"Name": "schedule_c"}},
        {"field": {"Name": "credits_c"}},
        {"field": {"Name": "color_c"}},
        {"field": {"Name": "semester_c"}},
        {"field": {"Name": "created_at_c"}}
      ]
    };

    const response = await apperClient.getRecordById('course_c', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data;
  },

  async create(courseData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: courseData.name_c,
        name_c: courseData.name_c,
        course_code_c: courseData.course_code_c,
        instructor_c: courseData.instructor_c,
        schedule_c: courseData.schedule_c,
        credits_c: parseInt(courseData.credits_c),
        color_c: courseData.color_c,
        semester_c: courseData.semester_c,
        created_at_c: new Date().toISOString()
      }]
    };

    const response = await apperClient.createRecord('course_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to create course:`, failed);
        throw new Error(failed[0].message || 'Failed to create course');
      }
      return response.results[0].data;
    }
  },

  async update(id, courseData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        Name: courseData.name_c,
        name_c: courseData.name_c,
        course_code_c: courseData.course_code_c,
        instructor_c: courseData.instructor_c,
        schedule_c: courseData.schedule_c,
        credits_c: parseInt(courseData.credits_c),
        color_c: courseData.color_c,
        semester_c: courseData.semester_c
      }]
    };

    const response = await apperClient.updateRecord('course_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to update course:`, failed);
        throw new Error(failed[0].message || 'Failed to update course');
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

    const response = await apperClient.deleteRecord('course_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to delete course:`, failed);
        throw new Error(failed[0].message || 'Failed to delete course');
      }
      return true;
    }
  }
};
export default courseService;
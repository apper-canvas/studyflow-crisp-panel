const studentService = {
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
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "enrollment_date_c"}},
        {"field": {"Name": "major_c"}},
        {"field": {"Name": "year_c"}},
        {"field": {"Name": "gpa_c"}}
      ]
    };

    const response = await apperClient.fetchRecords('student_c', params);
    
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
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "enrollment_date_c"}},
        {"field": {"Name": "major_c"}},
        {"field": {"Name": "year_c"}},
        {"field": {"Name": "gpa_c"}}
      ]
    };

    const response = await apperClient.getRecordById('student_c', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data;
  },

  async create(studentData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: studentData.name_c,
        name_c: studentData.name_c,
        email_c: studentData.email_c,
        phone_c: studentData.phone_c,
        enrollment_date_c: studentData.enrollment_date_c,
        major_c: studentData.major_c,
        year_c: studentData.year_c,
        gpa_c: studentData.gpa_c ? parseFloat(studentData.gpa_c) : null
      }]
    };

    const response = await apperClient.createRecord('student_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to create student:`, failed);
        throw new Error(failed[0].message || 'Failed to create student');
      }
      return response.results[0].data;
    }
  },

  async update(id, studentData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        Name: studentData.name_c,
        name_c: studentData.name_c,
        email_c: studentData.email_c,
        phone_c: studentData.phone_c,
        enrollment_date_c: studentData.enrollment_date_c,
        major_c: studentData.major_c,
        year_c: studentData.year_c,
        gpa_c: studentData.gpa_c ? parseFloat(studentData.gpa_c) : null
      }]
    };

    const response = await apperClient.updateRecord('student_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to update student:`, failed);
        throw new Error(failed[0].message || 'Failed to update student');
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

    const response = await apperClient.deleteRecord('student_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to delete student:`, failed);
        throw new Error(failed[0].message || 'Failed to delete student');
      }
      return true;
    }
  }
};

export default studentService;
const assignmentService = {
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
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "completed_at_c"}},
        {"field": {"Name": "course_id_c"}}
      ]
    };

    const response = await apperClient.fetchRecords('assignment_c', params);
    
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
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "completed_at_c"}},
        {"field": {"Name": "course_id_c"}}
      ]
    };

    const response = await apperClient.getRecordById('assignment_c', parseInt(id), params);
    
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
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "created_at_c"}},
        {"field": {"Name": "completed_at_c"}},
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

    const response = await apperClient.fetchRecords('assignment_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  },

  async create(assignmentData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: assignmentData.title_c,
        title_c: assignmentData.title_c,
        description_c: assignmentData.description_c,
        due_date_c: new Date(assignmentData.due_date_c).toISOString(),
        priority_c: assignmentData.priority_c,
        status_c: assignmentData.status_c,
        course_id_c: parseInt(assignmentData.course_id_c),
        created_at_c: new Date().toISOString()
      }]
    };

    const response = await apperClient.createRecord('assignment_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to create assignment:`, failed);
        throw new Error(failed[0].message || 'Failed to create assignment');
      }
      return response.results[0].data;
    }
  },

  async update(id, assignmentData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        Name: assignmentData.title_c,
        title_c: assignmentData.title_c,
        description_c: assignmentData.description_c,
        due_date_c: new Date(assignmentData.due_date_c).toISOString(),
        priority_c: assignmentData.priority_c,
        status_c: assignmentData.status_c,
        course_id_c: parseInt(assignmentData.course_id_c)
      }]
    };

    const response = await apperClient.updateRecord('assignment_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to update assignment:`, failed);
        throw new Error(failed[0].message || 'Failed to update assignment');
      }
      return response.results[0].data;
    }
  },

  async updateStatus(id, status) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const updateData = {
      status_c: status
    };

    if (status === "completed") {
      updateData.completed_at_c = new Date().toISOString();
    }

    const params = {
      records: [{
        Id: parseInt(id),
        ...updateData
      }]
    };

    const response = await apperClient.updateRecord('assignment_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to update status:`, failed);
        throw new Error(failed[0].message || 'Failed to update status');
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

    const response = await apperClient.deleteRecord('assignment_c', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to delete assignment:`, failed);
        throw new Error(failed[0].message || 'Failed to delete assignment');
      }
      return true;
    }
  }
};

export default assignmentService;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import StudentCard from '@/components/organisms/StudentCard';
import StudentForm from '@/components/organisms/StudentForm';
import Modal from '@/components/molecules/Modal';
import studentService from '@/services/api/studentService';

function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery, yearFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchQuery) {
const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        student.name_c?.toLowerCase().includes(query) ||
        student.email_c?.toLowerCase().includes(query) ||
        student.major_c?.toLowerCase().includes(query)
      );
    }

if (yearFilter !== 'all') {
      filtered = filtered.filter(student => student.year_c === yearFilter);
      filtered = filtered.filter(student => student.year === yearFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      await studentService.delete(id);
      setStudents(prev => prev.filter(s => s.Id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const handleSubmitStudent = async (studentData) => {
    try {
      if (editingStudent) {
        const updated = await studentService.update(editingStudent.Id, studentData);
        setStudents(prev => prev.map(s => s.Id === updated.Id ? updated : s));
        toast.success('Student updated successfully');
      } else {
        const created = await studentService.create(studentData);
        setStudents(prev => [...prev, created]);
        toast.success('Student created successfully');
      }
      setShowModal(false);
      setEditingStudent(null);
    } catch (err) {
      toast.error(editingStudent ? 'Failed to update student' : 'Failed to create student');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-600 mt-1">Manage your student roster</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddStudent}
          icon={<ApperIcon name="Plus" size={20} />}
        >
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by name, email, or major..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<ApperIcon name="Search" size={18} />}
          />
          <Select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="all">All Years</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </Select>
        </div>
      </div>

      {/* Student List */}
      {filteredStudents.length === 0 ? (
        <Empty
          icon={<ApperIcon name="Users" size={48} />}
          title="No students found"
          description={searchQuery || yearFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by adding your first student'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StudentCard
                student={student}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
      >
        <StudentForm
          student={editingStudent}
          onSubmit={handleSubmitStudent}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default Students;
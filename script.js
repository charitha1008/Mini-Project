class StudentManager {
    constructor() {
        this.students = this.loadStudents();
        this.editingId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        this.studentForm = document.getElementById('studentForm');
        this.studentName = document.getElementById('studentName');
        this.studentAge = document.getElementById('studentAge');
        this.studentGrade = document.getElementById('studentGrade');
        this.studentSubject = document.getElementById('studentSubject');
        this.submitBtn = document.getElementById('submitBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.formTitle = document.getElementById('formTitle');
        this.studentsGrid = document.getElementById('studentsGrid');
    }

    bindEvents() {
        this.studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.editingId) {
                this.updateStudent();
            } else {
                this.addStudent();
            }
        });

        this.cancelBtn.addEventListener('click', () => {
            this.cancelEdit();
        });
    }

    generateId() {
        return Date.now().toString();
    }

    addStudent() {
        const student = {
            id: this.generateId(),
            name: this.studentName.value.trim(),
            age: parseInt(this.studentAge.value),
            grade: this.studentGrade.value,
            subject: this.studentSubject.value.trim()
        };

        if (!student.name || !student.age || !student.grade || !student.subject) {
            alert('Please fill in all fields');
            return;
        }

        this.students.push(student);
        this.saveStudents();
        this.resetForm();
        this.render();
        alert('Student added successfully!');
    }

    updateStudent() {
        const index = this.students.findIndex(s => s.id === this.editingId);
        if (index === -1) return;

        this.students[index] = {
            id: this.editingId,
            name: this.studentName.value.trim(),
            age: parseInt(this.studentAge.value),
            grade: this.studentGrade.value,
            subject: this.studentSubject.value.trim()
        };

        this.saveStudents();
        this.cancelEdit();
        this.render();
        alert('Student updated successfully!');
    }

    editStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (!student) return;

        this.editingId = id;
        this.studentName.value = student.name;
        this.studentAge.value = student.age;
        this.studentGrade.value = student.grade;
        this.studentSubject.value = student.subject;

        this.formTitle.textContent = 'Edit Student';
        this.submitBtn.textContent = 'Update Student';
        this.cancelBtn.style.display = 'block';
    }

    deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.students = this.students.filter(s => s.id !== id);
            this.saveStudents();
            this.render();
            alert('Student deleted successfully!');
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.resetForm();
        this.formTitle.textContent = 'Add New Student';
        this.submitBtn.textContent = 'Add Student';
        this.cancelBtn.style.display = 'none';
    }

    resetForm() {
        this.studentForm.reset();
    }

    createStudentCard(student) {
        const card = document.createElement('div');
        card.className = 'student-card';

        card.innerHTML = `
            <div class="student-info">
                <div class="student-details">
                    <h3>${this.escapeHtml(student.name)}</h3>
                    <p><strong>Age:</strong> ${student.age} years</p>
                    <p><strong>Subject:</strong> ${this.escapeHtml(student.subject)}</p>
                    <p><strong>Grade:</strong> <span class="grade-badge grade-${student.grade}">${student.grade}</span></p>
                </div>
                <div class="student-actions">
                    <button class="btn btn-edit" onclick="studentManager.editStudent('${student.id}')">
                        Edit
                    </button>
                    <button class="btn btn-delete" onclick="studentManager.deleteStudent('${student.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    render() {
        this.studentsGrid.innerHTML = '';

        if (this.students.length === 0) {
            this.studentsGrid.innerHTML = `
                <div class="empty-message">
                    No students found. Add some students to get started!
                </div>
            `;
        } else {
            this.students.forEach(student => {
                const card = this.createStudentCard(student);
                this.studentsGrid.appendChild(card);
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveStudents() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    loadStudents() {
        const stored = localStorage.getItem('students');
        return stored ? JSON.parse(stored) : [];
    }
}

// Initialize the student manager
let studentManager;

document.addEventListener('DOMContentLoaded', () => {
    studentManager = new StudentManager();
    
    // Add sample data if no students exist
    if (studentManager.students.length === 0) {
        const sampleStudents = [
            {
                id: '1',
                name: 'John Smith',
                age: 20,
                grade: 'A',
                subject: 'Mathematics'
            },
            {
                id: '2',
                name: 'Sarah Johnson',
                age: 19,
                grade: 'B',
                subject: 'Physics'
            },
            {
                id: '3',
                name: 'Mike Davis',
                age: 21,
                grade: 'A',
                subject: 'Chemistry'
            }
        ];

        studentManager.students = sampleStudents;
        studentManager.saveStudents();
        studentManager.render();
    }
});
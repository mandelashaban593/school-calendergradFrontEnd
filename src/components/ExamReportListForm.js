import React, { useState } from 'react';
import axios from 'axios';
import { Button, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

const ClassReport = () => {
    const [className, setClassName] = useState('');
    const [students, setStudents] = useState([]);

    const handleGenerateReport = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/generate-report', { class_name: className });
            setStudents(response.data.students);
        } catch (error) {
            console.error('Failed to generate report:', error);
        }
    };

    const handlePrintAll = () => {
        // Implement print functionality here
        window.print();
    };

    return (
        <div>
            <h1>Generate Class Report</h1>
            <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter Class Name"
            />
            <Button variant="contained" color="primary" onClick={handleGenerateReport}>
                Generate Report
            </Button>
            <Button variant="contained" color="secondary" onClick={handlePrintAll}>
                Print All
            </Button>

            {students.length > 0 && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Division</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student, index) => (
                            <TableRow key={index}>
                                <TableCell>{student.student_name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.division}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default ClassReport;






// Please modify the codes of report in such a way that text about the shool name of the student 
// is displayed at the top center  , student_name, email is displayed after the name of the school. 
// The number of the report , the date of generation of the report is displayed at the top left corner
//  of the name of student, then  datable of the column  for  subject_name , then score, grade for each 
//  score column comes after that. Then the Divsion one or Division Two or Division three or failed is 
//  displayed at thebottom left corner , Aftet that the name 
// of the Head master and signature is displayed at the bottom right corner for approval. 
// Share full source code solution please 
import React from 'react'
import { useParams } from 'react-router-dom';

function ExamYearDetails() {
    const {exam_year_id} = useParams();
    return (
        <div>ExamYearDetails{exam_year_id}</div>
    )
}

export default ExamYearDetails;
interface ExamAnswers {
    [questionId: string]: number | number[];
}

let exams_rand_answers: { [examId: string]: ExamAnswers } = {};


const storeExamAnswers = (exam_id: string, correct_answers_json: string): boolean => {
    exams_rand_answers[exam_id] = JSON.parse(correct_answers_json); 
    return true;
};


function compareAnswers(correct_answers: ExamAnswers, user_answers: ExamAnswers): number {
    let correct_mcq_count = 0;

    // correct_answers = {1:4, 2:1, 3:2, 4:2}
    // user_answers    = {1:4, 2:3, 3:2, 4:2}

    for (const question_id in correct_answers) {
        const correct_answer = correct_answers[question_id];
        const user_answer = user_answers[question_id];

        if (user_answer && user_answer == correct_answer) {
            correct_mcq_count++;
        }
    }

    return correct_mcq_count;
}



const checkMcqAnswers = (exam_id: string, user_answers_json: string): number => {
    const correct = exams_rand_answers[exam_id];
    const user = JSON.parse(user_answers_json);

    return compareAnswers(correct, user);
};

export { storeExamAnswers, checkMcqAnswers };



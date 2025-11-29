interface ExamSession {
    student_id: string;
    exam_id: string;
    expire_at: Date;
}

let exam_session: { [sessionId: string]: ExamSession } = {};   

function generateRandomId(): string {
    const id = Math.random().toString(36).substring(2, 15);

    if (exam_session[id]) {
        return generateRandomId(); 
    }
    return id;
}

const createSessionId = (student_id: string, exam_id: string, duration_minutes: number): string => {
    const now = new Date();
    
    const expire_at = new Date(now.getTime() + duration_minutes * 60000);  // expiration time as a Date object

    const sessId = generateRandomId();

    exam_session[sessId] = {
        student_id: student_id,
        exam_id: exam_id,
        expire_at: expire_at
    };

    return sessId;
};

const getSessionId = (session_id: string): boolean => {
    const session = exam_session[session_id]

    if(!session){
        return false
    }

    const now = new Date();
    if(session.expire_at < now){
        return false
    }

    return true
}

export {createSessionId, getSessionId}


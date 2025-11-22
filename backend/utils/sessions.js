
let exam_session = []

function generateRandomId() {
   const id = Math.random().toString(36).substring(2, 15);

   if(exam_session.find(id)){
    generateRandomId()
   }else {
    return id
   }
}

const session = (student_id) =>{

}
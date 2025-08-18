import Chapter from '../models/Chapter.js'
import {z} from 'zod'

const chapterRegSchema = {
    class_id : z.string(),
    chapter_url : z.array(z.string()),
    chapter_name : z.string(),
    chapter_description : z.string().optional(),
    chapter_notes : z.array(z.string()),

}

const createChapter = async (req, res) => {
    try {
        const chapterSchema = chapterRegSchema.safeParse(req.body);
        if (!chapterSchema) {
            res.status(400).json({
                "message": "Invalid inputs"
            })
        }

        const chapter = await Chapter.create(chapter.data);
        if (!chapter) {
            res.status(400).json({
                "message": "chapter creation failed"
            })
        }

        res.status(200).json({
            "message": "Chapter created successfully",
            data: {
                chapter: {
                    chapter_id: chapter._id,
                    chapter_name: chapter.chapter_name,
                    chapter_notes: chapter.chapter_notes,
                    chapter_url: chapter.chapter_url,
                    chapter_description: chapter.chapter_description,
                    chapter_status: chapter.chapter_status,
                    created: chapter.createdAt,
                    updated_at: chapter.updatedAt,
                }
            }
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            "message": "Internal Server Error",
            "error": e
        })
    }
}







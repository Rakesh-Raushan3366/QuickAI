import sql from "../configs/db.js";



// Create your controller here.

// Generate Get User Creation function here.
export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth()

        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId}
         ORDER BY created_at DESC`;

        res.json({ success: true, creations });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Generate Get Published Creation function here.
export const getPublishedCreations = async (req, res) => {
    try {

        const creations = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
        res.json({ success: true, creations });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Generate Get Published Creation function here.
export const toggleLikeCreation = async (req, res) => {
    try {

        const { userId } = req.auth()
        const { id } = req.body

        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`

        if (!creation) {
            return res.json({ success: false, message: "Creation not found" })
        }

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter((user) => user !== userIdStr);
            message = 'Creation Unliked'
        } else {
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creation Liked'
        }

        const fromattedArray = `{${updatedLikes.join(',')}}`

        await sql`UPDATE creations SET likes = ${fromattedArray}::text[] WHERE id = ${id}`;

        res.json({ success: true, message });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
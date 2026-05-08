const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/schedule-interview', async (req, res) => {
  const { name, date, time } = req.body;
  
  // Generate a unique meeting link (using Jitsi for instant links)
  const meetLink = `https://meet.jit.si/ZenTalent-${uuidv4().slice(0,8)}`;

  console.log(`Interview scheduled for ${name} on ${date} at ${time}. Link: ${meetLink}`);

  // Future: Save to database (Supabase/Postgres)
  // await sql`UPDATE candidates SET status = 'Invited', meeting_link = ${meetLink} WHERE name = ${name}`;

  res.json({ 
    success: true, 
    meetLink, 
    message: `Interview scheduled for ${name} on ${date} at ${time}` 
  });
});

module.exports = router;

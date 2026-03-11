import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PARENT_TIPS = [
  "Watch together, then use the song in real moments throughout the day — repetition is how it sticks!",
  "After watching, role-play the situation with stuffed animals. Let your child 'teach' the lesson back to you.",
  "Print out the strategy song and put it somewhere visible, like the fridge or their bedroom door.",
  "When the moment happens in real life, start singing the song softly — don't wait until things escalate.",
  "Ask your child: 'What did Daniel do when he felt that way?' It helps them connect the show to real life.",
  "Try singing the strategy song yourself first, so your child sees you using it too.",
  "Watch the episode a few times over several days — kids often absorb more on repeat viewings.",
  "Before a situation you know is coming (like a doctor visit), watch the episode together as preparation.",
  "After watching, ask: 'Can you show me what Daniel did?' Acting it out helps it stick.",
  "Use the song as a gentle redirect — singing it together during a hard moment can defuse tension.",
  "Make the song silly and fun when things are calm, so it becomes a positive association.",
  "Let your child teach the strategy to a sibling, grandparent, or stuffed animal — teaching reinforces learning!",
];

// feelings used for the "not quite right?" filter
const FEELINGS = [
  { id: "angry",      label: "😤 Angry / Frustrated" },
  { id: "sad",        label: "😢 Sad / Left Out" },
  { id: "scared",     label: "😰 Scared / Anxious" },
  { id: "jealous",    label: "😒 Jealous / Envious" },
  { id: "excited",    label: "🤩 Too Excited / Overwhelmed" },
  { id: "lonely",     label: "😔 Lonely / Missing Someone" },
  { id: "proud",      label: "🌟 Building Confidence" },
  { id: "change",     label: "😬 Dealing With Change" },
  { id: "empathy",    label: "🤝 Learning Empathy / Kindness" },
  { id: "routine",    label: "🕐 Routines / Transitions" },
];

const EPISODES = [
  // Season 1
  { season: 1, episode: "101", title: "Daniel's Birthday / Daniel's Picnic", feelings: ["sad","scared"], book: { title: "Daniel Tiger's Neighborhood: Daniel's Birthday", url: "https://www.amazon.com/s?k=Daniel+Tiger+Birthday+book" }, tags: ["birthday", "disappointment", "plans change", "bad day", "things go wrong", "upset about plans"], lesson: "When something seems bad, you can turn it around and find something good.", song: "When something seems bad, turn it around, and find something good!" },
  { season: 1, episode: "102", title: "Daniel Visits the Doctor", feelings: ["scared","change"], book: { title: "Daniel Goes to the Doctor", url: "https://www.amazon.com/s?k=Daniel+Tiger+Goes+to+the+Doctor" }, tags: ["doctor", "checkup", "shots", "nervous about doctor", "scared of doctor", "medical", "going to doctor", "new things", "unknown"], lesson: "When we do something new, it helps to talk about what we'll do first.", song: "When we do something new, let's talk about what we'll do." },
  { season: 1, episode: "103", title: "Daniel's Babysitter / Daniel Goes to School", feelings: ["scared","lonely","change"], book: { title: "Daniel Goes to School", url: "https://www.amazon.com/s?k=Daniel+Tiger+Goes+to+School" }, tags: ["babysitter", "parents leaving", "separation anxiety", "goodbye", "parents coming back", "daycare", "drop off", "miss mommy", "miss daddy", "will parents come back"], lesson: "Grown-ups always come back.", song: "Grown-ups come back." },
  { season: 1, episode: "104", title: "Daniel Gets Mad / Katerina Gets Mad", feelings: ["angry"], book: { title: "Daniel's Tiger Grr-ific Feelings", url: "https://www.amazon.com/s?k=Daniel+Tiger+Grr+feelings+book" }, tags: ["mad", "angry", "anger", "temper", "hitting", "aggressive", "furious", "rage", "frustrated angry", "wants to roar"], lesson: "When you feel so mad, taking a deep breath and counting to four helps you calm down.", song: "When you feel so mad that you want to roar, take a deep breath and count to four." },
  { season: 1, episode: "105", title: "Find a Way to Play Together", feelings: ["angry","empathy"], book: null, tags: ["playing together", "different play styles", "can't agree", "cooperative play", "taking turns playing", "won't play my way"], lesson: "Even when kids want to play differently, you can find a way to play together.", song: "Find a way to play together." },
  { season: 1, episode: "106", title: "A Friend Just Wants to Play With You", feelings: ["lonely","sad"], book: null, tags: ["friendship", "making friends", "friend wants to play", "playing with friends", "being included", "lonely", "no one to play with"], lesson: "A good friend just wants to spend time playing with you.", song: "A friend just wants to play with you." },
  { season: 1, episode: "107", title: "Friends Help Each Other", feelings: ["empathy"], book: null, tags: ["helping", "friends help", "being helpful", "kindness", "cooperation", "working together"], lesson: "Friends help each other — yes, they do!", song: "Friends help each other, yes they do, it's true!" },
  { season: 1, episode: "108", title: "Making Something to Say I Love You", feelings: ["empathy","proud"], book: null, tags: ["love", "gifts", "making gifts", "showing love", "parents", "valentine", "appreciation", "gratitude"], lesson: "Making something is a special way to say 'I love you.'", song: "Making something is one way to say 'I love you.'" },
  { season: 1, episode: "109", title: "Look Closer to Find Out", feelings: ["proud"], book: null, tags: ["curious", "learning", "exploring", "wondering", "questions", "discovery", "science"], lesson: "Look a little closer to find out what you want to know.", song: "Look a little closer to find out what we want to know." },
  { season: 1, episode: "110", title: "Daniel Shares His Car / Katerina Shares Her Tutu", feelings: ["angry","empathy"], book: { title: "Daniel Shares His Tigertastic Car", url: "https://www.amazon.com/s?k=Daniel+Tiger+Shares+Tigertastic+Car" }, tags: ["sharing", "won't share", "taking turns", "mine", "possessive", "selfish", "toys", "sharing toys", "not sharing"], lesson: "You can take a turn, and then you'll get it back — that's what sharing means!", song: "You can take a turn, and then I'll get it back." },
  { season: 1, episode: "111", title: "Prince Wednesday Goes to the Potty", feelings: ["proud","change"], book: { title: "Daniel Goes to the Potty", url: "https://www.amazon.com/s?k=Daniel+Tiger+goes+to+the+potty+book" }, tags: ["potty training", "toilet", "potty", "bathroom", "accidents", "diaper", "big kid"], lesson: "When you have to go potty, stop and go right away. Then flush and wash!", song: "When you have to go potty, stop and go right away. Flush and wash and be on your way!" },
  { season: 1, episode: "112", title: "Everyone Is Big Enough to Help", feelings: ["proud"], book: null, tags: ["helping", "too little", "can't help", "feeling small", "big enough", "capable", "independence", "growing up"], lesson: "Everyone is big enough to do something helpful.", song: "Everyone is big enough, big enough to do something." },
  { season: 1, episode: "113", title: "Daniel Waits / Waiting at the Restaurant", feelings: ["angry","excited"], book: null, tags: ["waiting", "patience", "impatient", "wants it now", "waiting in line", "hard to wait", "instant gratification", "not my turn yet"], lesson: "When you have to wait, you can play, sing, or imagine anything to pass the time.", song: "When you wait, you can play, sing, or imagine anything." },
  { season: 1, episode: "114", title: "Thank You Day", feelings: ["empathy"], book: null, tags: ["thank you", "gratitude", "appreciation", "thankful", "being polite", "manners", "saying thanks"], lesson: "Saying thank you shows people you appreciate everything they do.", song: "Thank you for everything you do." },
  { season: 1, episode: "115", title: "The Neighborhood Votes / The Class Votes", feelings: ["empathy","angry"], book: null, tags: ["voting", "choices", "decision making", "fairness", "democracy", "opinions", "group decisions"], lesson: "Stop, think, and choose — it's how we make good decisions together.", song: "Stop, think, and choose." },
  { season: 1, episode: "116", title: "Try New Food", feelings: ["scared","change"], book: { title: "Daniel Tries a New Food", url: "https://www.amazon.com/s?k=Daniel+Tiger+tries+new+food" }, tags: ["picky eater", "new food", "won't eat", "vegetables", "trying food", "food issues", "doesn't like food", "only eats certain foods"], lesson: "Try new food — it might taste good! You won't know until you try.", song: "Try new food because it might taste good." },
  { season: 1, episode: "117", title: "Good Morning / Goodnight Daniel", feelings: ["routine"], book: { title: "Daniel Tiger's Goodnight Daniel", url: "https://www.amazon.com/s?k=Daniel+Tiger+Goodnight" }, tags: ["morning routine", "bedtime", "getting ready", "daily routine", "morning", "getting dressed", "brushing teeth", "routine", "bedtime routine", "school morning"], lesson: "Having a routine for mornings and bedtime helps everything go smoothly.", song: "Clothes on, eat breakfast, brush teeth, put on shoes, and off to school. Bath time, PJs, brush teeth, story and song, and off to bed." },
  { season: 1, episode: "118", title: "Daniel Gets a Shot / A Stormy Day", feelings: ["scared"], book: { title: "Daniel Gets a Shot", url: "https://www.amazon.com/s?k=Daniel+Tiger+Gets+a+Shot" }, tags: ["shot", "needle", "vaccine", "scared", "stormy weather", "thunder", "lightning", "storm", "nervous", "something scary"], lesson: "Close your eyes and think of something happy to get through scary moments.", song: "Close your eyes and think of something happy." },
  { season: 1, episode: "119", title: "Keep Trying", feelings: ["angry","proud"], book: null, tags: ["giving up", "can't do it", "failing", "frustration", "practice", "persistence", "keep trying", "not good at something", "learning new skill"], lesson: "Keep trying — you'll get better!", song: "Keep trying, you'll get better. Keep on trying and you'll feel proud!" },
  { season: 1, episode: "120", title: "Daniel's Sleepover / Backyard Camping", feelings: ["scared","change"], book: null, tags: ["sleepover", "nervous sleepover", "sleeping away from home", "camping", "scared at night", "something unfamiliar", "unknown situation"], lesson: "When something seems scary, look to see what it really is — you might feel better.", song: "See what it is. You might feel better." },
  { season: 1, episode: "121", title: "You Are Special / Daniel Is Special", feelings: ["proud","sad"], book: { title: "You Are Special, Daniel Tiger", url: "https://www.amazon.com/s?k=You+Are+Special+Daniel+Tiger" }, tags: ["unique", "special", "self esteem", "confidence", "being yourself", "different is okay", "identity", "self worth", "comparison"], lesson: "I like you just the way you are — you are special!", song: "I like you just the way you are." },
  { season: 1, episode: "122", title: "Work Together", feelings: ["empathy","angry"], book: null, tags: ["teamwork", "working together", "cooperation", "can't do alone", "group work", "collaboration", "team"], lesson: "If you can't do it alone, work together!", song: "If you can't do it alone, work together." },
  { season: 1, episode: "123", title: "Clean Up Time", feelings: ["routine","angry"], book: null, tags: ["cleaning up", "messy", "won't clean up", "tidying", "clean room", "picking up toys", "chores"], lesson: "Clean up, pick up, put away — clean up every day!", song: "Clean up, pick up, put away. Clean up every day." },
  { season: 1, episode: "124", title: "Play Pretend / Super Daniel", feelings: ["proud","excited"], book: null, tags: ["imagination", "pretend play", "make believe", "creative play", "dress up", "superheroes"], lesson: "When you pretend, you can be anything!", song: "When you pretend you can be anything." },
  { season: 1, episode: "125", title: "Daniel Uses His Words", feelings: ["angry","sad"], book: { title: "Daniel Uses His Words", url: "https://www.amazon.com/s?k=Daniel+Tiger+Uses+His+Words" }, tags: ["communication", "use words", "expressing feelings", "talking about feelings", "instead of crying", "instead of hitting", "words for feelings"], lesson: "Use your words to tell people how you feel.", song: "Use your words." },
  { season: 1, episode: "126", title: "Daniel Says I'm Sorry", feelings: ["empathy","sad"], book: null, tags: ["apology", "sorry", "apologizing", "hurt someone", "made a mistake", "regret", "fixing things", "conflict"], lesson: "Saying 'I'm sorry' is the first step — then ask 'How can I help?'", song: "Saying 'I'm sorry' is the first step. Then, 'How can I help?'" },
  { season: 1, episode: "127", title: "It's Almost Time to Stop", feelings: ["routine","angry"], book: null, tags: ["transitions", "stop playing", "screen time", "won't stop", "transitions hard", "switching activities", "time to go", "leaving playground"], lesson: "It's almost time to stop, so choose one more thing to do.", song: "It's almost time to stop, so choose one more thing to do. That was fun but now it's done." },
  { season: 1, episode: "128", title: "Stop and Listen to Stay Safe", feelings: ["scared"], book: null, tags: ["safety", "rules", "listening to adults", "following directions", "staying safe", "danger", "fire drill", "emergency"], lesson: "Stop and listen to stay safe.", song: "Stop and listen to stay safe." },
  { season: 1, episode: "129", title: "Neighbor Day", feelings: ["empathy"], book: null, tags: ["neighbors", "community", "being kind", "helping others", "community helpers", "nice to neighbors"], lesson: "Do something nice for your neighbor and your friends.", song: "Do something nice for your neighbor. Do something nice for your friends." },
  { season: 1, episode: "130", title: "Take a Deep Breath to Calm Down", feelings: ["angry","excited","scared"], book: null, tags: ["calm down", "overwhelmed", "overstimulated", "too excited", "loud", "calming", "self regulation", "storytime", "quiet time"], lesson: "Give a squeeze, take a deep breath nice and slow, and let it go to calm down.", song: "Give a squeeze, nice and slow. Take a deep breath and let it go." },
  { season: 1, episode: "131", title: "Same and Different / Daniel's New Friend", feelings: ["empathy","change"], book: null, tags: ["differences", "similarities", "new friend", "different people", "diversity", "different backgrounds", "meeting new people", "accepting differences"], lesson: "In some ways we are different, but in so many ways we are the same.", song: "In some ways we are different, but in so many ways, we are the same." },
  { season: 1, episode: "132", title: "Dress Up Any Way You Choose", feelings: ["proud"], book: null, tags: ["dress up", "clothes", "costume", "self expression", "gender", "boys clothes", "girls clothes", "freedom to choose"], lesson: "Dress up any way you choose — find a way that's right for you.", song: "Dress up any way you choose. Find a way that's right for you." },
  { season: 1, episode: "135", title: "Daniel Gets a Cold / Mom Tiger Is Sick", feelings: ["scared","sad"], book: null, tags: ["sick", "cold", "flu", "not feeling well", "ill", "staying home sick", "virus", "resting when sick", "mom sick"], lesson: "When you're sick, rest is best.", song: "When you're sick, rest is best." },
  { season: 1, episode: "136", title: "Daniel Feels Left Out", feelings: ["sad","lonely"], book: null, tags: ["left out", "excluded", "lonely", "sad", "not included", "friends playing without me", "rejected by friends"], lesson: "It's okay to feel sad sometimes. Little by little, you'll feel better again.", song: "It's okay to feel sad sometimes. Little by little, you'll feel better again." },
  { season: 1, episode: "137", title: "Daniel Gets Frustrated / Frustration at School", feelings: ["angry"], book: null, tags: ["frustrated", "frustration", "something isn't working", "give up", "too hard", "step back", "ask for help when frustrated"], lesson: "When you're feeling frustrated, take a step back and ask for help.", song: "When you're feeling frustrated, take a step back and ask for help." },
  { season: 1, episode: "138", title: "Daniel Is Jealous", feelings: ["jealous"], book: null, tags: ["jealous", "jealousy", "envy", "wants what others have", "not fair", "someone has something I want", "comparing", "sibling jealousy"], lesson: "When you feel jealous, talk about it and we'll figure something out.", song: "When you feel jealous, talk about it and we'll figure something out." },
  { season: 1, episode: "139", title: "Think About How Someone Else Is Feeling", feelings: ["empathy"], book: null, tags: ["empathy", "feelings of others", "being kind", "someone is sad", "noticing feelings", "caring", "compassion"], lesson: "Think about how someone else is feeling — and show them you care.", song: "Think about how someone else is feeling." },
  { season: 1, episode: "140", title: "Everyone's Job Is Important", feelings: ["proud","empathy"], book: null, tags: ["jobs", "community helpers", "responsibility", "chores", "purpose", "fairness", "everyone contributes"], lesson: "Everyone's job is important — we all help in different ways.", song: "Everyone's job is important. We all help in different ways." },
  // Season 2
  { season: 2, episode: "201", title: "The Tiger Family Grows / Big Brother Daniel", feelings: ["change","jealous"], book: { title: "Daniel Learns to Be a Big Brother", url: "https://www.amazon.com/s?k=Daniel+Tiger+big+brother" }, tags: ["new baby", "baby sibling", "baby brother", "baby sister", "pregnancy", "new sibling coming", "becoming big sibling", "big helper"], lesson: "You can be a big helper in your family when a new baby comes.", song: "You can be a big helper in your family." },
  { season: 2, episode: "203", title: "There's Time for You and Baby Too", feelings: ["jealous","sad","change"], book: null, tags: ["new baby jealousy", "mom busy with baby", "dad busy with baby", "feel forgotten", "baby takes attention", "sibling rivalry", "new sibling adjustment"], lesson: "Even with a new baby, there's still time for you.", song: "There's time for you and baby, too." },
  { season: 2, episode: "204", title: "When a Baby Makes Things Different", feelings: ["angry","change"], book: null, tags: ["baby changes things", "new baby hard", "things are different", "adjusting to baby", "frustrated with baby", "baby ruining fun"], lesson: "When a baby makes things different, find a way to make things fun.", song: "When a baby makes things different, find a way to make things fun." },
  { season: 2, episode: "205", title: "Try to Solve the Problem Yourself", feelings: ["proud","angry"], book: null, tags: ["problem solving", "independence", "figure it out", "solve it myself", "self reliance", "thinking through problems", "proud of yourself"], lesson: "Try to solve the problem yourself and you'll feel proud!", song: "Try to solve the problem yourself and you'll feel proud." },
  { season: 2, episode: "206", title: "When a Friend Doesn't Want to Play", feelings: ["sad","lonely"], book: null, tags: ["friend says no", "rejected", "friend won't play with me", "find something else to do", "friend playing with others", "lonely", "friend busy"], lesson: "When a friend doesn't want to play with you, you can find something else to do.", song: "When a friend doesn't want to play with you, you can find something else to do." },
  { season: 2, episode: "207", title: "Try It a Little Bit at a Time", feelings: ["scared","angry"], book: null, tags: ["try something new", "scary new thing", "overwhelming", "big challenge", "breaking it down", "small steps", "nervous about trying", "new activity"], lesson: "If something seems hard to do, try it a little bit at a time.", song: "If something seems hard to do, try it a little bit at a time." },
  { season: 2, episode: "208", title: "Find Your Own Way to Say I Love You", feelings: ["empathy","proud"], book: null, tags: ["showing love", "love day", "valentine", "love languages", "ways to show love", "expressing love", "caring for others"], lesson: "Find your own special way to say 'I love you.'", song: "Find your own way to say 'I love you.'" },
  { season: 2, episode: "210", title: "When You Get Hurt, Find a Grown-Up", feelings: ["scared"], book: null, tags: ["hurt", "injured", "fell down", "boo boo", "accident", "scraped knee", "find adult when hurt", "getting hurt"], lesson: "When you get hurt, find a grown-up to help you feel better.", song: "When you get hurt, find a grown-up to help you feel better." },
  { season: 2, episode: "211", title: "When You Can't Get What You Want", feelings: ["angry","sad"], book: null, tags: ["can't have it", "wants something", "no", "denied something", "disappointed", "stomp feelings out", "disappointment", "not getting what you want"], lesson: "When you can't get what you want, stomp three times to help yourself feel better.", song: "When you can't get what you want, stomp three times to help yourself feel better." },
  { season: 2, episode: "213", title: "Take a Grown-Up's Hand in a Storm", feelings: ["scared"], book: null, tags: ["storm", "thunder", "lightning", "scared of storms", "emergency", "follow the plan", "natural disaster", "safety plan"], lesson: "Take a grown-up's hand, follow the plan, and you'll be safe.", song: "Take a grown-up's hand, follow the plan, and you'll be safe." },
  { season: 2, episode: "214", title: "We Like Different Things and That's Fine", feelings: ["empathy","angry"], book: null, tags: ["different interests", "different opinions", "disagreement about favorites", "respecting others choices", "different preferences", "be kind anyway"], lesson: "We like different things, and that's just fine — but remember to be kind.", song: "We like different things and that's just fine, but remember to be kind." },
  { season: 2, episode: "215", title: "A Neighbor Is Here to Help", feelings: ["scared","empathy"], book: null, tags: ["lost pet", "neighbors help", "community", "asking for help", "missing something", "community support", "help from neighbors"], lesson: "A neighbor is here to help.", song: "A neighbor is here to help." },
  { season: 2, episode: "216", title: "It's Okay to Make Mistakes", feelings: ["sad","angry","scared"], book: null, tags: ["mistake", "accident", "broke something", "messed up", "failure", "perfectionism", "spilled something", "error", "wrong answer"], lesson: "It's okay to make mistakes. Try to fix them and learn from them too.", song: "It's okay to make mistakes. Try to fix them and learn from them, too." },
  { season: 2, episode: "217", title: "Think About What Other People Need Too", feelings: ["empathy"], book: null, tags: ["selfish", "only thinking of myself", "others needs", "consideration", "thinking of others", "empathy", "sharing attention", "baby needs"], lesson: "Whatever you do, think about what other people need too.", song: "Whatever you do, think about what other people need, too." },
  { season: 2, episode: "219", title: "It Helps to Say What You're Feeling", feelings: ["sad","angry","scared"], book: null, tags: ["emotions", "feelings", "identifying feelings", "name your feeling", "emotional awareness", "expressing emotions", "how am I feeling"], lesson: "It helps to say what you're feeling.", song: "It helps to say what you're feeling." },
  { season: 2, episode: "220", title: "When Something Is New, Holding a Hand Helps", feelings: ["scared","change"], book: null, tags: ["new experience", "new place", "scared of new", "hold hands", "unfamiliar", "transition", "new environment", "comfort"], lesson: "When something is new, holding a hand can help you feel safe.", song: "When something is new, holding a hand can help you." },
  { season: 2, episode: "222", title: "Even When Friends Play With Someone New", feelings: ["jealous","sad","lonely"], book: null, tags: ["new kid", "best friend playing with someone else", "friend has new friend", "jealous of friendship", "feeling replaced", "left out of friendship"], lesson: "Even when friends play with someone new, they will still be friends with you.", song: "Even when friends play with someone new, they will still be friends with you." },
  // Season 3
  { season: 3, episode: "301", title: "You're Still You, No Matter What You Wear", feelings: ["scared","change","proud"], book: null, tags: ["identity", "appearance", "clothes", "haircut", "changing looks", "still me", "self identity", "who am I"], lesson: "You can change your hair or what you wear, but no matter what, you're still you.", song: "You can change your hair or what you wear, but no matter what you do, you're still you." },
  { season: 3, episode: "302", title: "Sharing Is Fun for Me Too", feelings: ["empathy","angry"], book: null, tags: ["sharing library books", "sharing with sibling", "sharing with baby", "taking turns with sibling", "won't share with brother", "won't share with sister"], lesson: "Sharing with you is fun for me too!", song: "Sharing with you is fun for me, too." },
  { season: 3, episode: "303", title: "We Take Care of Each Other", feelings: ["empathy","scared"], book: null, tags: ["allergies", "food allergies", "being careful", "taking care of friends", "looking out for others", "nut allergy", "keeping friends safe"], lesson: "We take care of each other.", song: "We take care of each other." },
  { season: 3, episode: "305", title: "Do Your Best", feelings: ["proud","angry","sad"], book: null, tags: ["best effort", "trying hard", "competition", "winning", "losing", "sports", "games", "performance", "doing well", "not winning", "field day"], lesson: "Do your best — your best is the best for you.", song: "Do your best. Your best is the best for you." },
  { season: 3, episode: "306", title: "If There's a Problem, Talk and Make a Plan", feelings: ["angry","empathy"], book: null, tags: ["problem solving", "conflict", "talking through problems", "making a plan", "disagreement", "plan ahead", "road trip", "car ride"], lesson: "If there's a problem, talk about it and make a plan.", song: "If there's a problem, talk about it and make a plan." },
  { season: 3, episode: "307", title: "You're Big Enough to Think of What to Do", feelings: ["proud"], book: null, tags: ["big enough", "independence", "old enough", "growing up", "capable", "can do it myself", "solving own problems"], lesson: "You're big enough to think of what to do!", song: "You're big enough to think of what to do." },
  { season: 3, episode: "310", title: "Wherever You Go, Find Something You Know", feelings: ["scared","change","lonely"], book: null, tags: ["new place", "comfort objects", "familiar things", "travel", "hospital", "new classroom", "nervous new place", "anxiety new environment"], lesson: "Wherever you go, you can find something you know to help you feel better.", song: "Wherever you go, you can find something you know to help you feel better." },
  { season: 3, episode: "313", title: "This Is My Happy Song", feelings: ["sad","proud"], book: null, tags: ["happy", "joy", "happiness", "feeling good", "celebration", "cheering up", "happy place", "boost mood"], lesson: "Find your happy song and sing it when you need a boost!", song: "This is my happy song and I can sing it all day long." },
  { season: 3, episode: "316", title: "Grr Out Loud", feelings: ["angry"], book: null, tags: ["frustrated", "can't do trick", "can't do skill", "grumpy", "expressing frustration", "letting it out", "trying hard things"], lesson: "Grr, grr, grr out loud — keep on trying and you'll feel proud!", song: "Grr, grr, grr out loud. Keep on trying and you'll feel proud!" },
  { season: 3, episode: "318", title: "Find What's Different and What's the Same", feelings: ["scared","change","lonely"], book: null, tags: ["travel", "new place", "visiting", "familiar vs new", "homesick", "feeling comfortable away from home", "grandparents house", "relatives"], lesson: "When you're away, you can play this game — find what's different and what's the same.", song: "When you're away you can play this game — find what's different and what's the same." },
  { season: 3, episode: "320", title: "It Helps to Say I'm Mad", feelings: ["angry"], book: null, tags: ["mad", "angry", "beach", "disappointment", "frustration", "expressing anger", "say you're mad", "name your anger"], lesson: "Mad, mad, mad! It helps to say 'I'm mad.'", song: "Mad, mad, mad. It helps to say I'm mad." },
  { season: 3, episode: "322", title: "Look Around to Find Something to Do", feelings: ["lonely","sad"], book: null, tags: ["bored", "grown ups busy", "parent busy", "parent on phone", "nothing to do", "entertain yourself", "independent play", "adults can't play now"], lesson: "When grown-ups are too busy to play, look around to find something to do.", song: "When grown-ups are too busy to play with you, look around to find something to do." },
  { season: 3, episode: "314", title: "Daniel Goes to Sleep / Prince Wednesday Sleeps Over", feelings: ["routine","scared"], book: null, tags: ["can't sleep", "bedtime", "countdown", "settle down", "wind down", "end of day", "too hyper", "too wound up", "can't settle", "sleepover bedtime"], lesson: "Count down from five to calm down and get ready for sleep.", song: "It's time to sleep. The day is done. Let's countdown to calm down. Five-four-three-two-one." },
  { season: 3, episode: "315", title: "Daniel Takes His Time / Sometimes It's Good to Go Slow", feelings: ["routine","angry"], book: null, tags: ["rushing", "slow down", "take your time", "hurrying", "going slow", "mindfulness", "being present"], lesson: "Sometimes it's good to go slow and enjoy what you're doing.", song: "Sometimes it's good to go slow." },
  { season: 3, episode: "316", title: "King Daniel For the Day", feelings: ["empathy","angry"], book: null, tags: ["being kind", "choices", "kindness", "how to treat others", "power", "bossiness", "choosing kindness"], lesson: "Even when you're in charge, you can always choose to be kind.", song: "You can choose to be kind." },
  { season: 3, episode: "317", title: "Firefighters at School / Daniel's Doll", feelings: ["proud","change"], book: null, tags: ["gender roles", "boys with dolls", "girl things boy things", "identity", "stereotypes", "be more than one thing", "interests"], lesson: "You can be more than one thing — you don't have to fit into just one box.", song: "You can be more than one thing." },
  { season: 3, episode: "318", title: "Daniel's Very Different Day / Class Trip to the Library", feelings: ["change","scared"], book: null, tags: ["change in plans", "substitute teacher", "unexpected change", "flexibility", "different day", "routine broken", "plans changed"], lesson: "Things may change and that's okay — today we can do things a different way.", song: "Things may change and that's okay. Today we can do things a different way." },
  { season: 3, episode: "319", title: "Daniel Loves Tigey / Daniel Needs Tigey at School", feelings: ["scared","sad","lonely"], book: null, tags: ["comfort object", "stuffed animal", "security blanket", "transition object", "tigey", "soothing", "upset at school", "scared without comfort object"], lesson: "When you're upset, you can find a way to feel better.", song: "When you're upset, you can find a way to feel better." },
  { season: 3, episode: "320", title: "Daniel's Goldfish Dies / Daniel's Strawberry Seeds", feelings: ["sad","scared"], book: null, tags: ["death", "pet died", "goldfish", "grief", "loss", "someone died", "asking about death", "dying"], lesson: "When something hard happens like a death, it's okay to ask questions — it might help.", song: "Ask questions about what happened. It might help." },
  { season: 3, episode: "321", title: "Daniel Wants to Be Alone / Daniel's Alone Space", feelings: ["angry","sad"], book: null, tags: ["alone time", "introvert", "needs space", "quiet time", "personal space", "need to be alone", "alone place", "recharge"], lesson: "Sometimes you want to be alone, and that's okay — you can find a space that's your very own.", song: "Sometimes you want to be alone. You can find a place your very own." },
  { season: 3, episode: "322", title: "Daniel Gets Mad at Dad / Daniel Gets Mad at His Friends", feelings: ["angry"], book: null, tags: ["mad at parent", "mad at friend", "angry at someone you love", "conflict with loved one", "anger and love", "hug it out"], lesson: "You can be mad at someone you love. When you are ready, give them a hug.", song: "You can be mad at someone you love. When you are ready, give them a hug." },
  { season: 3, episode: "323", title: "Daniel Doesn't Want to Go Potty / Daniel Sits on the Potty", feelings: ["routine","change"], book: null, tags: ["potty reluctance", "won't try potty", "potty training resistance", "sit and try", "using bathroom", "toilet training"], lesson: "Maybe you have to go, maybe not — why not sit and try?", song: "Do you have to go potty? Maybe yes. Maybe no. Why don't you sit and try to go." },
  { season: 3, episode: "324", title: "Circle Time Squabble / It's Not Okay to Hurt Someone", feelings: ["angry"], book: null, tags: ["hitting", "hurting others", "physical aggression", "biting", "kicking", "not okay to hurt", "anger and hitting", "anger management"], lesson: "It's okay to feel angry — but it is never okay to hurt someone.", song: "Stop, stop, stop. It's okay to feel angry. It's not, not, not okay to hurt someone." },
  { season: 3, episode: "325", title: "Daniel Wonders About Trolley", feelings: ["proud","change"], book: null, tags: ["curiosity", "wondering", "asking questions", "how things work", "exploring questions", "learning", "finding out more"], lesson: "When you wonder about something, you can try to find out more!", song: "When you wonder, you can try to find out more." },
  { season: 3, episode: "312", title: "Daniel Feels Two Feelings / The Neighborhood Carnival", feelings: ["sad","excited","angry"], book: null, tags: ["two feelings", "mixed emotions", "complicated feelings", "two feelings at once", "happy and sad", "excited and scared", "multiple emotions"], lesson: "Sometimes you feel two feelings at the same time, and that's okay.", song: "Sometimes you feel two feelings at the same time, and that's okay." },

  // Season 4
  { season: 4, episode: "401", title: "Daniel Finds Something to Do", feelings: ["lonely","sad"], book: null, tags: ["bored", "grown ups busy", "parent busy", "parent on phone", "nothing to do", "entertain yourself", "independent play", "adults can't play now", "find something to do"], lesson: "When grown-ups are too busy to play, look around to find something to do.", song: "When grown-ups are too busy to play with you, look around, look around, to find something to do." },
  { season: 4, episode: "402", title: "Daniel's Lunch / Daniel's Toy", feelings: ["empathy","angry"], book: null, tags: ["different preferences", "different tastes", "liking different things", "respect others choices", "kindness despite differences", "we like different things"], lesson: "We like different things and that's just fine — but always remember to be kind.", song: "We like different things and that's just fine. But remember to be kind." },
  { season: 4, episode: "404", title: "Jodi's First Day of School / Daniel Plays at Jodi's House", feelings: ["scared","change","lonely"], book: null, tags: ["new school", "first day school", "new place", "comfort in new place", "familiar things", "new friend", "new environment", "familiar objects"], lesson: "Wherever you go, you can find something you know to help you feel better.", song: "Wherever you go, you can find something you know to help you feel better." },
  { season: 4, episode: "405", title: "A New Friend at School / A New Friend at the Playground", feelings: ["jealous","sad","lonely"], book: null, tags: ["new kid", "best friend playing with someone else", "friend has new friend", "jealous of friendship", "feeling replaced", "left out", "friend still likes me"], lesson: "Even when friends play with someone new, they will still be friends with you.", song: "Even when friends play with someone new, they will still be friends with you." },
  { season: 4, episode: "406", title: "Daniel Visits the Dentist / Daniel's First Haircut", feelings: ["scared","change"], book: null, tags: ["dentist", "haircut", "new experience", "nervous about dentist", "scared of dentist", "scared of haircut", "unfamiliar", "talking about new things"], lesson: "When we do something new, talking about what we'll do helps.", song: "When we do something new, let's talk about what we'll do." },
  { season: 4, episode: "407", title: "Daniel's Obstacle Course / Daniel Plays in a Gentle Way", feelings: ["empathy","angry"], book: null, tags: ["rough play", "gentle", "being careful with others", "playing rough", "body awareness", "gentle hands", "play gently", "hurting during play"], lesson: "Sometimes you need to play in a gentle way to keep everyone safe.", song: "Sometimes you need to play the gentle way." },
  { season: 4, episode: "408", title: "Daniel Learns to Ask First / Friends Ask First", feelings: ["empathy","angry"], book: null, tags: ["asking permission", "taking without asking", "grab", "ask first", "consent", "borrowing", "taking someone's toy", "permission"], lesson: "Before you take something away, stop and ask if it's okay first.", song: "Before you take something away, stop and ask if it's okay." },
  { season: 4, episode: "409", title: "Daniel Does Gymnastics / The Big Slide", feelings: ["scared","proud"], book: null, tags: ["bravery", "being brave", "scary challenge", "gymnastics", "big slide", "trying scary thing", "courage", "with a little help", "help being brave"], lesson: "With a little help, you can be brave enough to try something scary.", song: "With a little help, you can be brave." },
  { season: 4, episode: "410", title: "Daniel's Blueberry Paws / Wow at the Library", feelings: ["proud","excited"], book: null, tags: ["mindfulness", "enjoying the moment", "paying attention", "being present", "wow moments", "wonder", "appreciating things", "noticing beauty"], lesson: "Slow down and enjoy the 'wow' that's happening right now.", song: "Enjoy the wow that's happening now." },
  { season: 4, episode: "411", title: "Jodi's Mama Travels for Work / The Tiger Family Babysits", feelings: ["scared","lonely","change"], book: null, tags: ["parent traveling", "parent away for work", "missing parent", "parent gone", "babysitter", "parents come back", "separation anxiety"], lesson: "Even when a grown-up has to go away for work, grown-ups always come back.", song: "Grown-ups come back." },
  { season: 4, episode: "412", title: "Margaret's Birthday Buddy / Margaret's Birthday Party", feelings: ["jealous","empathy"], book: null, tags: ["not my birthday", "sibling birthday", "other person's birthday", "jealous of birthday", "birthday buddy", "helping celebrate others", "not the center of attention"], lesson: "When it's not your birthday, you can still be a birthday buddy and help make it special.", song: "When it's not your birthday, what can you do? Be a birthday buddy and help out, too." },
  { season: 4, episode: "413", title: "Find What Makes Your Family Special / Family Day", feelings: ["proud","empathy"], book: null, tags: ["family", "family differences", "different families", "what is a family", "special family", "diverse families", "family traditions"], lesson: "All families are different — find what makes yours special.", song: "All families are different. Find what makes your family special." },
  { season: 4, episode: "414", title: "Daniel Likes to Be With Dad / Daniel Likes to Be With Mom", feelings: ["empathy","proud"], book: null, tags: ["quality time", "time with parent", "bonding", "parent child time", "just being together", "doesn't matter what we do", "togetherness"], lesson: "It doesn't matter what you do — what matters is being together.", song: "It doesn't matter what we do. I just like to be with you." },
  { season: 4, episode: "415", title: "The Family Campout / A Game Night for Everyone", feelings: ["empathy","change"], book: null, tags: ["family differences", "different families", "diverse families", "accepting different families", "inclusive", "all families"], lesson: "Families are different, and that's okay — all families can have fun together.", song: "Families are different and that's okay." },
  { season: 4, episode: "416", title: "Daniel's Grr-ific Grandpere / Making Mozies With Nana", feelings: ["proud","empathy"], book: null, tags: ["grandparents", "special time with grandparent", "traditions", "grandparent relationship", "family bond", "making memories"], lesson: "Cherish the special things you do with the people you love.", song: "I love the special things I do with you." },
  { season: 4, episode: "417", title: "Daniel's Tiger Twirl / You Can Play Your Own Way", feelings: ["proud"], book: null, tags: ["own way", "individuality", "doing it differently", "your own style", "unique approach", "don't have to do it like everyone else", "confidence"], lesson: "You can do things your own way — the Daniel way!", song: "You can do things your own way. The Daniel way." },
  { season: 4, episode: "418", title: "Calm at the Restaurant / Calm in Class", feelings: ["excited","angry","routine"], book: null, tags: ["calm down restaurant", "calm in public", "overstimulated", "too loud", "public behavior", "self regulation out", "calming strategy"], lesson: "Give a squeeze, nice and slow — take a deep breath and let it go.", song: "Give a squeeze nice and slow. Take a deep breath and let it go." },
  { season: 4, episode: "419", title: "Mad at the Crayon Factory / O Gets Mad", feelings: ["angry"], book: null, tags: ["mad", "angry", "crayon factory", "anger management", "deep breath", "count to four", "losing temper", "furious"], lesson: "When you feel so mad you want to roar, take a deep breath and count to four.", song: "When you feel so mad that you want to roar, take a deep breath and count to four." },

  // Season 5
  { season: 5, episode: "501", title: "Prince Wednesday's Accident / Daniel and Miss Elaina's Kite Accident", feelings: ["scared","sad"], book: null, tags: ["accident", "tell someone", "confessing accident", "broke something by accident", "kite accident", "telling the truth about accident", "owning up"], lesson: "When accidents happen, tell someone — it can really help.", song: "When accidents happen you should tell someone and it can help." },
  { season: 5, episode: "502", title: "Quiet Time at School / Naptime in Blanket City", feelings: ["routine","angry"], book: null, tags: ["nap time", "quiet time", "won't rest", "rest time", "naptime resistance", "can't sleep naptime", "relax at school", "rest strategies"], lesson: "You can close your eyes, snuggle, or take a deep breath — do what helps you rest.", song: "Close your eyes. Snuggle. Or take a deep breath. You can do what helps you rest." },
  { season: 5, episode: "503", title: "The Fire Drill / Daniel and Mom Go to the Market", feelings: ["scared","routine"], book: null, tags: ["fire drill", "safety drill", "emergency plan", "loud alarm", "scared of fire drill", "safety rules", "listening for safety"], lesson: "Stop and listen to stay safe — even when things are loud or scary.", song: "Stop and listen to stay safe." },
  { season: 5, episode: "504", title: "Daniel Waits With Dad / Margaret's New Shoes", feelings: ["angry","excited"], book: null, tags: ["waiting again", "patience", "waiting with parent", "impatient at store", "hard to wait shopping", "new shoes", "waiting while shopping"], lesson: "When you have to wait, you can play, sing, or imagine anything!", song: "When you wait, you can play, sing, or imagine anything." },
  { season: 5, episode: "505", title: "Daniel's Substitute Teacher", feelings: ["change","scared"], book: null, tags: ["substitute teacher", "change in routine", "unexpected change", "different teacher", "teacher is absent", "teacher away", "things change", "flexibility"], lesson: "Things may change and that's okay — today we can do things a different way.", song: "Things may change and that's okay. Today we can do things a different way." },
  { season: 5, episode: "506", title: "Daniel's New Friend Max / A New Friend at the Clock Factory", feelings: ["empathy","change"], book: null, tags: ["friend with different needs", "different abilities", "inclusive friendship", "friend who needs different things", "accommodations", "disability", "special needs friend"], lesson: "When a friend needs different things than you, there are ways you can still play together.", song: "When a friend needs different things than you, there are some things you can do." },
  { season: 5, episode: "507", title: "Jodi's Asthma / Daniel and Max Play at the Playground", feelings: ["empathy","scared"], book: null, tags: ["asthma", "health condition", "friend with illness", "inclusive play", "everyone can play", "adapting games", "playing with different abilities"], lesson: "We can always find a way for everyone to play together.", song: "We can find a way for everyone to play." },
  { season: 5, episode: "508", title: "Daniel's Rocking Chair / Prince Wednesday Gives Away His Book", feelings: ["empathy","proud"], book: null, tags: ["giving to others", "donating", "sharing belongings", "giving away toys", "generosity", "charity", "giving books away", "helping others by giving"], lesson: "You can choose things you own and give them to someone else to enjoy.", song: "You can choose things like books or a toy and give them to someone else to enjoy." },
  { season: 5, episode: "509", title: "Daniel Does It Himself / Daniel Learns to Swing", feelings: ["proud","angry"], book: null, tags: ["independent", "do it myself", "I can do it", "learning to swing", "big kid skills", "growing independence", "try yourself", "you're big enough now"], lesson: "You're big enough now — you can try it yourself!", song: "You're big enough now. You can try it yourself." },
  { season: 5, episode: "511", title: "Daniel Goes to the Hospital", feelings: ["scared","change"], book: null, tags: ["hospital", "overnight hospital", "surgery", "medical procedure", "scared of hospital", "staying in hospital", "IV", "hospital stay"], lesson: "Doctors and nurses at the hospital are there to take care of you.", song: "Grown-ups are here to take care of you." },

  // Season 6
  { season: 6, episode: "601", title: "Daniel's New Babysitter / Daniel Sleeps at the Treehouse", feelings: ["scared","change","lonely"], book: null, tags: ["new babysitter", "unfamiliar caregiver", "sleeping away", "treehouse sleepover", "parents leaving again", "new caretaker", "different babysitter"], lesson: "Even with a new grown-up taking care of you, grown-ups always come back.", song: "Grown-ups come back." },
  { season: 6, episode: "602", title: "Daniel Feels Worried About Mom / Jodi Loses Benji", feelings: ["scared","sad","lonely"], book: null, tags: ["worried about parent", "mom sick", "mom not feeling well", "lost stuffed animal", "lost comfort object", "lost toy", "anxiety about parent health", "worried"], lesson: "When you feel worried, it helps to ask questions and talk about what's happening.", song: "Ask questions about what's happening. It might help." },
  { season: 6, episode: "603", title: "Jodi Tries Ballet / Daniel Tries Something New With Grandpere", feelings: ["scared","proud"], book: null, tags: ["try ballet", "new activity", "nervous about new class", "first dance class", "trying something new with family", "new skill with grandparent", "bravery trying new things"], lesson: "Trying something new can be scary, but with support you can be brave.", song: "With a little help, you can be brave." },
  { season: 6, episode: "604", title: "Daniel Goes to Day Camp / Daniel's Rainy Day at Camp", feelings: ["scared","change","sad"], book: null, tags: ["day camp", "summer camp", "new camp", "rainy day plans change", "camp plans changed", "camp anxiety", "first day camp", "plans ruined by rain"], lesson: "Even when plans change, you can find a way to make things fun.", song: "Things may change and that's okay. Today we can do things a different way." },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function findEpisode(query) {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 3);
  const scores = EPISODES.map(ep => {
    let score = 0;
    ep.tags.forEach(tag => {
      if (q.includes(tag)) score += 4;
      else tag.split(" ").forEach(tw => { if (tw.length > 3 && q.includes(tw)) score += 1; });
    });
    words.forEach(word => { ep.tags.forEach(tag => { if (tag.includes(word)) score += 1; }); });
    return { ...ep, score };
  });
  scores.sort((a, b) => b.score - a.score);
  return scores[0];
}

function getRandomTip() {
  return PARENT_TIPS[Math.floor(Math.random() * PARENT_TIPS.length)];
}

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────

const T = {
  bg:           "#F7F4F0",
  surface:      "#FFFFFF",
  surfaceAlt:   "#F2EDE8",
  terracotta:   "#B5613A",
  terracottaLight: "#F5E8E1",
  ink:          "#1C1410",
  inkMid:       "#5C4A3A",
  inkLight:     "#A08070",
  rule:         "#E5DDD6",
  serif:        "'Playfair Display', Georgia, serif",
  sans:         "'DM Sans', system-ui, sans-serif",
  gold:         "#C8963A",
  goldLight:    "#FBF4E6",
  sage:         "#5A7A5A",
  sageLight:    "#EBF2EB",
  slate:        "#4A6070",
  slateLight:   "#EBF0F4",
  crisis:       "#8B2E2E",   // deep red for crisis mode
  crisisBg:     "#FDF0F0",
};

// ─── EXAMPLES ────────────────────────────────────────────────────────────────

const EXAMPLES = [
  "Feeling angry", "New baby sibling", "Going to the doctor",
  "Bedtime struggles", "Won't share", "Scared of storms",
  "Missing a parent", "Picky eater", "Making mistakes",
  "Can't wait patiently", "Feeling left out", "Feeling jealous",
];

// ─── SVG ILLUSTRATIONS ───────────────────────────────────────────────────────

function TigerFace({ size = 48, color = T.terracotta }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 28 L8 10 L26 20 Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
      <path d="M66 28 L72 10 L54 20 Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
      <path d="M16 26 L12 14 L24 21 Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" fill={color} opacity="0.15"/>
      <path d="M64 26 L68 14 L56 21 Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" fill={color} opacity="0.15"/>
      <ellipse cx="40" cy="44" rx="28" ry="26" stroke={color} strokeWidth="2.2" fill="none"/>
      <path d="M35 22 Q40 18 45 22" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <ellipse cx="30" cy="40" rx="4" ry="4.5" stroke={color} strokeWidth="2" fill="none"/>
      <ellipse cx="50" cy="40" rx="4" ry="4.5" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="31" cy="41" r="1.8" fill={color}/>
      <circle cx="51" cy="41" r="1.8" fill={color}/>
      <ellipse cx="40" cy="50" rx="3.5" ry="2.5" fill={color} opacity="0.7"/>
      <path d="M37 53 Q40 57 43 53" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M18 48 Q22 46 20 50" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <path d="M19 52 Q23 50 22 54" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <path d="M62 48 Q58 46 60 50" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <path d="M61 52 Q57 50 58 54" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      <path d="M20 68 Q40 74 60 68" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
    </svg>
  );
}

function Trolley({ size = 36, color = T.terracotta }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="72" height="26" rx="6" stroke={color} strokeWidth="2.2" fill="none"/>
      <path d="M10 10 L70 10 L66 4 L14 4 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"/>
      <rect x="12" y="15" width="14" height="10" rx="2" stroke={color} strokeWidth="1.8" fill="none" opacity="0.7"/>
      <rect x="33" y="15" width="14" height="10" rx="2" stroke={color} strokeWidth="1.8" fill="none" opacity="0.7"/>
      <rect x="54" y="15" width="14" height="10" rx="2" stroke={color} strokeWidth="1.8" fill="none" opacity="0.7"/>
      <circle cx="18" cy="38" r="6" stroke={color} strokeWidth="2.2" fill="none"/>
      <circle cx="62" cy="38" r="6" stroke={color} strokeWidth="2.2" fill="none"/>
      <circle cx="18" cy="38" r="2" fill={color} opacity="0.5"/>
      <circle cx="62" cy="38" r="2" fill={color} opacity="0.5"/>
      <line x1="2" y1="44" x2="78" y2="44" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
    </svg>
  );
}

function MusicNote({ size = 20, color = T.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18V5l12-2v13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="18" r="3" stroke={color} strokeWidth="1.8" fill="none"/>
      <circle cx="18" cy="16" r="3" stroke={color} strokeWidth="1.8" fill="none"/>
    </svg>
  );
}

function LittleHouse({ size = 28, color = T.terracotta }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 24 L24 6 L44 24" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
      <rect x="8" y="24" width="32" height="20" rx="1" stroke={color} strokeWidth="2.2" fill="none"/>
      <path d="M20 44 L20 34 Q24 31 28 34 L28 44" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      <rect x="10" y="28" width="8" height="7" rx="1" stroke={color} strokeWidth="1.6" fill="none" opacity="0.7"/>
      <rect x="30" y="28" width="8" height="7" rx="1" stroke={color} strokeWidth="1.6" fill="none" opacity="0.7"/>
      <rect x="30" y="10" width="5" height="10" stroke={color} strokeWidth="1.8" fill="none"/>
    </svg>
  );
}

function BookIcon({ size = 22, color = T.inkMid }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4C2 4 6 3 12 3C18 3 22 4 22 4V20C22 20 18 19 12 19C6 19 2 20 2 20V4Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      <line x1="12" y1="3" x2="12" y2="19" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <line x1="5" y1="8" x2="10" y2="8" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <line x1="5" y1="11" x2="10" y2="11" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <line x1="14" y1="8" x2="19" y2="8" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <line x1="14" y1="11" x2="19" y2="11" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

function Sparkle({ size = 16, color = T.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L13.5 9 L20 8 L14.5 13 L17 20 L12 16 L7 20 L9.5 13 L4 8 L10.5 9 Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

// Tiger paw print — for the loading state
function PawPrint({ size = 40, color = T.terracotta, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Toe beans */}
      <ellipse cx="18" cy="14" rx="6" ry="7" fill={color} opacity="0.8"/>
      <ellipse cx="31" cy="10" rx="6" ry="7" fill={color} opacity="0.8"/>
      <ellipse cx="44" cy="14" rx="6" ry="7" fill={color} opacity="0.8"/>
      <ellipse cx="10" cy="26" rx="5" ry="6" fill={color} opacity="0.8"/>
      {/* Main pad */}
      <ellipse cx="31" cy="38" rx="16" ry="14" fill={color}/>
    </svg>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Label({ children, color }) {
  return (
    <div style={{
      fontFamily: T.sans, fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.12em",
      textTransform: "uppercase", color: color || T.inkLight, marginBottom: 6,
    }}>{children}</div>
  );
}

// ── Paw Loading State ────────────────────────────────────────────────────────
function PawLoader() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 20 }}>
        {[0, 1, 2].map(i => (
          <PawPrint
            key={i}
            size={28}
            color={T.terracotta}
            className="paw-pulse"
            style={{ animationDelay: `${i * 0.22}s` }}
          />
        ))}
      </div>
      <p style={{ fontFamily: T.serif, fontSize: "1rem", fontStyle: "italic", color: T.inkMid, margin: 0 }}>
        Finding your episode…
      </p>
    </div>
  );
}

// ── Episode Mini Card ────────────────────────────────────────────────────────
function EpisodeMiniCard({ ep, onClick, animClass = "" }) {
  return (
    <div onClick={() => onClick(ep)}
      className={animClass}
      style={{
        border: `1px solid ${T.rule}`, borderRadius: 8, padding: "14px 16px",
        marginBottom: 8, cursor: "pointer", background: T.surface,
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = T.terracotta}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.rule}
    >
      <div style={{ fontFamily: T.sans, fontSize: "0.7rem", color: T.inkLight, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
        Season {ep.season}
      </div>
      <div style={{ fontFamily: T.serif, fontSize: "1rem", color: T.ink, marginBottom: 6, lineHeight: 1.3 }}>{ep.title}</div>
      <div style={{ fontFamily: T.sans, fontSize: "0.82rem", color: T.inkMid, lineHeight: 1.5, fontStyle: "italic" }}>"{ep.song}"</div>
    </div>
  );
}

// ── All Lessons Page ─────────────────────────────────────────────────────────
function AllLessonsPage({ onBack }) {
  const [search, setSearch] = useState("");
  const filtered = EPISODES.filter(ep =>
    !search ||
    ep.title.toLowerCase().includes(search.toLowerCase()) ||
    ep.lesson.toLowerCase().includes(search.toLowerCase()) ||
    ep.song.toLowerCase().includes(search.toLowerCase())
  );
  const bySeason = [1,2,3,4,5,6].map(s => ({ season: s, eps: filtered.filter(e => e.season === s) })).filter(g => g.eps.length > 0);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, padding: "0 20px 60px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ padding: "40px 0 32px", borderBottom: `1px solid ${T.rule}`, marginBottom: 32 }} className="fade-slide-up">
          <button onClick={onBack} style={{ fontFamily: T.sans, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkLight, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}>
            ← Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
            <LittleHouse size={36} />
            <h1 style={{ fontFamily: T.serif, fontSize: "2.4rem", color: T.ink, margin: 0, fontWeight: 400 }}>All Lessons</h1>
          </div>
          <p style={{ fontFamily: T.sans, fontSize: "0.9rem", color: T.inkMid, margin: 0, fontWeight: 300 }}>
            {EPISODES.length} episodes across 6 seasons — a grr-ific reference for parents
          </p>
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by topic, lesson, or song..."
          style={{
            width: "100%", border: `1px solid ${T.rule}`, borderRadius: 6,
            padding: "12px 16px", fontFamily: T.sans, fontSize: "0.95rem",
            background: T.surface, outline: "none", boxSizing: "border-box",
            color: T.ink, marginBottom: 36,
          }}
        />

        {bySeason.map(({ season, eps }, si) => (
          <div key={season} style={{ marginBottom: 40 }} className={`fade-slide-up-${Math.min(si+1,5)}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <MusicNote size={14} color={T.terracotta} />
              <div style={{ fontFamily: T.serif, fontSize: "0.85rem", color: T.terracotta, fontWeight: 600, letterSpacing: "0.05em" }}>Season {season}</div>
              <div style={{ flex: 1, height: 1, background: T.rule }} />
              <div style={{ fontFamily: T.sans, fontSize: "0.75rem", color: T.inkLight }}>{eps.length} episodes</div>
            </div>
            {eps.map(ep => (
              <div key={ep.episode} style={{ background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 8, padding: "16px 20px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.sans, fontSize: "0.68rem", color: T.inkLight, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                      Season {ep.season}
                    </div>
                    <div style={{ fontFamily: T.serif, fontSize: "1.05rem", color: T.ink, marginBottom: 8, lineHeight: 1.3 }}>{ep.title}</div>
                    <div style={{ fontFamily: T.sans, fontSize: "0.85rem", color: T.inkMid, marginBottom: 8, lineHeight: 1.6 }}>{ep.lesson}</div>
                    <div style={{ fontFamily: T.sans, fontSize: "0.82rem", color: T.gold, fontStyle: "italic", lineHeight: 1.5 }}>♪ "{ep.song}"</div>
                  </div>
                  {ep.book && (
                    <a href={ep.book.url} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily: T.sans, fontSize: "0.72rem", letterSpacing: "0.08em",
                      textTransform: "uppercase", color: T.slate, textDecoration: "none",
                      border: `1px solid ${T.slate}`, borderRadius: 4, padding: "4px 10px",
                      whiteSpace: "nowrap", flexShrink: 0, fontWeight: 500,
                    }}>Book →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div style={{ textAlign: "center", fontFamily: T.sans, fontSize: "0.78rem", color: T.inkLight, paddingTop: 20 }}>
          Not affiliated with PBS Kids or The Fred Rogers Company
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage]                   = useState("home"); // home | result | library | crisis
  const [challenge, setChallenge]         = useState("");
  const [result, setResult]               = useState(null);
  const [tip, setTip]                     = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [history, setHistory]             = useState([]); // [{query, result, tip}]
  const [resultKey, setResultKey]         = useState(0); // forces re-animation on new result
  const [crisisFeeling, setCrisisFeeling] = useState(null);

  // Scroll to top whenever a new result is shown
  useEffect(() => {
    if (resultKey > 0) setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0);
  }, [resultKey]);

  function runSearch(query) {
    if (!query.trim()) return;
    setLoading(true);
    setSelectedFeeling(null);
    setTimeout(() => {
      const ep  = findEpisode(query);
      const t   = getRandomTip();
      setResult(ep);
      setTip(t);
      setResultKey(k => k + 1);
      setLoading(false);
      setPage("result");
      // prepend to history (max 4, no dupes)
      setHistory(prev => {
        const next = [{ query, result: ep, tip: t }, ...prev.filter(h => h.query !== query)];
        return next.slice(0, 4);
      });
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 700); // brief pause for the paw loader
  }

  function handleFind() { runSearch(challenge); }

  function handlePickEpisode(ep) {
    const t = getRandomTip();
    setResult(ep);
    setTip(t);
    setResultKey(k => k + 1);
    setSelectedFeeling(null);
  }

  function goHome() {
    setPage("home");
    setResult(null);
    setChallenge("");
    setSelectedFeeling(null);
    setCrisisFeeling(null);
  }

  const altEpisodes = selectedFeeling
    ? EPISODES.filter(ep => ep.feelings.includes(selectedFeeling) && ep.episode !== result?.episode).slice(0, 5)
    : [];

  const crisisEpisodes = crisisFeeling
    ? EPISODES.filter(ep => ep.feelings.includes(crisisFeeling)).slice(0, 4)
    : [];

  if (page === "library") return <AllLessonsPage onBack={goHome} />;

  // ── CRISIS MODE ─────────────────────────────────────────────────────────────
  if (page === "crisis") {
    return (
      <div style={{ minHeight: "100vh", background: T.crisisBg, fontFamily: T.sans, color: T.ink }}>
        {/* Nav */}
        <div style={{ borderBottom: `1px solid #E8C8C8`, background: T.surface, padding: "0 24px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={goHome} style={{ fontFamily: T.serif, fontSize: "1.1rem", fontWeight: 400, color: T.ink, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <TigerFace size={28} />
              Daniel Tiger Helper
            </button>
            <button onClick={goHome} style={{ fontFamily: T.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkMid, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              ← Back to search
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ padding: "40px 0 28px", borderBottom: `1px solid #E8C8C8` }} className="fade-slide-up">
            <div style={{ fontFamily: T.sans, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: T.crisis, marginBottom: 12 }}>
              Moment of crisis
            </div>
            <h1 style={{ fontFamily: T.serif, fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 400, color: T.ink, margin: "0 0 12px", lineHeight: 1.15 }}>
              What is your child<br /><em>feeling right now?</em>
            </h1>
            <p style={{ fontFamily: T.sans, fontSize: "0.88rem", color: T.inkMid, margin: 0, fontWeight: 300, lineHeight: 1.7 }}>
              Tap a feeling — get the song instantly. No typing needed.
            </p>
          </div>

          {/* Big feeling buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "28px 0 0" }} className="fade-slide-up-2">
            {FEELINGS.map(f => (
              <button key={f.id}
                onClick={() => setCrisisFeeling(crisisFeeling === f.id ? null : f.id)}
                style={{
                  fontFamily: T.sans, fontSize: "0.95rem", fontWeight: crisisFeeling === f.id ? 500 : 400,
                  color: crisisFeeling === f.id ? T.surface : T.ink,
                  background: crisisFeeling === f.id ? T.crisis : T.surface,
                  border: `1.5px solid ${crisisFeeling === f.id ? T.crisis : T.rule}`,
                  borderRadius: 8, padding: "16px 12px", cursor: "pointer",
                  transition: "all 0.15s", textAlign: "left", lineHeight: 1.3,
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Instant results */}
          {crisisFeeling && crisisEpisodes.length > 0 && (
            <div style={{ marginTop: 32 }} className="fade-slide-up">
              <div style={{ fontFamily: T.sans, fontSize: "0.68rem", color: T.crisis, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                Try one of these — tap to see the full episode
              </div>
              {crisisEpisodes.map((ep, i) => (
                <div key={ep.episode}
                  className={`fade-slide-up-${Math.min(i+1,5)}`}
                  onClick={() => { handlePickEpisode(ep); setPage("result"); }}
                  style={{
                    background: T.surface, border: `1.5px solid #E8C8C8`,
                    borderRadius: 8, padding: "16px 20px", marginBottom: 10, cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = T.crisis}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#E8C8C8"}
                >
                  {/* The song is the hero in crisis mode */}
                  <div style={{ fontFamily: T.serif, fontSize: "1.05rem", color: T.crisis, fontStyle: "italic", marginBottom: 8, lineHeight: 1.5 }}>
                    ♪ "{ep.song}"
                  </div>
                  <div style={{ fontFamily: T.sans, fontSize: "0.78rem", color: T.inkLight, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {ep.title} · Season {ep.season}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LOADING ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ animationDelay: `${i * 0.22}s` }} className="paw-bounce">
              <PawPrint size={36} color={T.terracotta} />
            </div>
          ))}
        </div>
        <p style={{ fontFamily: T.serif, fontSize: "1.1rem", fontStyle: "italic", color: T.inkMid, margin: 0 }}>
          Finding your grr-ific episode…
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.sans, color: T.ink }}>

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${T.rule}`, background: T.surface, padding: "0 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={goHome} style={{ fontFamily: T.serif, fontSize: "1.1rem", fontWeight: 400, color: T.ink, background: "none", border: "none", cursor: "pointer", padding: 0, letterSpacing: "0.01em", display: "flex", alignItems: "center", gap: 10 }}>
            <TigerFace size={28} />
            Daniel Tiger Helper
          </button>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <button onClick={() => setPage("crisis")} style={{
              fontFamily: T.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
              color: T.crisis, background: "none", border: `1px solid ${T.crisis}`,
              borderRadius: 4, padding: "5px 12px", cursor: "pointer", fontWeight: 500,
            }}>Crisis Mode</button>
            <button onClick={() => setPage("library")} style={{
              fontFamily: T.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
              color: T.inkMid, background: "none", border: "none", cursor: "pointer", fontWeight: 500,
            }}>All Lessons</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── HOME ── */}
        {page === "home" && (
          <>
            <div style={{ padding: "56px 0 40px", borderBottom: `1px solid ${T.rule}` }} className="fade-slide-up">
              <div style={{ marginBottom: 20 }}>
                <TigerFace size={64} />
              </div>
              <div style={{ fontFamily: T.sans, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: T.terracotta, marginBottom: 14 }}>
                Grr-ific parenting starts here
              </div>
              <h1 style={{ fontFamily: T.serif, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 400, color: T.ink, margin: "0 0 16px", lineHeight: 1.15 }}>
                Find the right episode<br /><em>for the right moment.</em>
              </h1>
              <p style={{ fontFamily: T.sans, fontSize: "0.95rem", color: T.inkMid, margin: 0, maxWidth: 480, lineHeight: 1.7, fontWeight: 300 }}>
                Describe what your child is going through — a big feeling, a hard situation, a lesson you want to teach — and we'll find the Daniel Tiger episode that fits. Ugga Mugga.
              </p>
            </div>

            <div style={{ padding: "36px 0" }} className="fade-slide-up-2">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Trolley size={32} />
                <Label>What's going on with your child?</Label>
              </div>
              <textarea
                value={challenge}
                onChange={e => setChallenge(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleFind(); }}
                placeholder="e.g. My son melts down every time we have to leave the playground... (nifty as that sounds)"
                style={{
                  width: "100%", border: `1px solid ${T.rule}`, borderRadius: 6,
                  padding: "14px 16px", fontFamily: T.sans, fontSize: "0.95rem",
                  minHeight: 100, resize: "vertical", color: T.ink,
                  background: T.surface, outline: "none", boxSizing: "border-box",
                  lineHeight: 1.6, fontWeight: 300,
                }}
                onFocus={e => e.target.style.borderColor = T.terracotta}
                onBlur={e => e.target.style.borderColor = T.rule}
              />

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12, marginBottom: 24 }}>
                {EXAMPLES.map(ex => (
                  <button key={ex} onClick={() => setChallenge(ex)} style={{
                    fontFamily: T.sans, fontSize: "0.78rem", color: challenge === ex ? T.surface : T.inkMid,
                    background: challenge === ex ? T.terracotta : "transparent",
                    border: `1px solid ${challenge === ex ? T.terracotta : T.rule}`,
                    borderRadius: 4, padding: "5px 12px", cursor: "pointer", fontWeight: 400,
                    transition: "all 0.15s",
                  }}>{ex}</button>
                ))}
              </div>

              <button onClick={handleFind} disabled={!challenge.trim()} style={{
                fontFamily: T.sans, fontSize: "0.82rem", letterSpacing: "0.12em",
                textTransform: "uppercase", fontWeight: 500,
                background: challenge.trim() ? T.terracotta : T.rule,
                color: challenge.trim() ? T.surface : T.inkLight,
                border: "none", borderRadius: 6, padding: "14px 32px",
                cursor: challenge.trim() ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}>
                Find My Nifty-Galifty Episode
              </button>
            </div>

            {/* Search history */}
            {history.length > 0 && (
              <div style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 28 }} className="fade-in">
                <Label>Recent searches</Label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {history.map((h, i) => (
                    <button key={i}
                      onClick={() => { setChallenge(h.query); setResult(h.result); setTip(h.tip); setResultKey(k=>k+1); setPage("result"); }}
                      style={{
                        fontFamily: T.sans, fontSize: "0.88rem", color: T.inkMid,
                        background: "transparent", border: `1px solid ${T.rule}`,
                        borderRadius: 6, padding: "10px 14px", cursor: "pointer",
                        textAlign: "left", display: "flex", justifyContent: "space-between",
                        alignItems: "center", gap: 12, transition: "border-color 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = T.terracotta}
                      onMouseLeave={e => e.currentTarget.style.borderColor = T.rule}
                    >
                      <span style={{ fontWeight: 400 }}>{h.query}</span>
                      <span style={{ fontFamily: T.serif, fontSize: "0.8rem", color: T.inkLight, fontStyle: "italic", flexShrink: 0 }}>
                        → {h.result.title.split(" / ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ borderTop: `1px solid ${T.rule}`, marginTop: 28, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontFamily: T.sans, fontSize: "0.78rem", color: T.inkLight }}>
                {EPISODES.length} episodes across 6 seasons
              </div>
              <div style={{ fontFamily: T.sans, fontSize: "0.78rem", color: T.inkLight }}>
                Not affiliated with PBS Kids · Ugga Mugga
              </div>
            </div>
          </>
        )}

        {/* ── RESULT ── */}
        {page === "result" && result && (
          <div key={resultKey}>
            <div style={{ paddingTop: 28, paddingBottom: 28, borderBottom: `1px solid ${T.rule}` }} className="fade-in">
              <button onClick={goHome} style={{ fontFamily: T.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkLight, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                ← New search
              </button>
            </div>

            <div style={{ padding: "36px 0 32px", borderBottom: `1px solid ${T.rule}` }} className="fade-slide-up">
              <div style={{ fontFamily: T.sans, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: T.terracotta, marginBottom: 12 }}>
                Grr-ific match · Season {result.season}
              </div>
              <h2 style={{ fontFamily: T.serif, fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 400, color: T.ink, margin: "0 0 14px", lineHeight: 1.2 }}>
                {result.title}
              </h2>
              <p style={{ fontFamily: T.sans, fontSize: "0.95rem", color: T.inkMid, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>
                {result.lesson}
              </p>
            </div>

            <div style={{ padding: "28px 0", borderBottom: `1px solid ${T.rule}` }} className="fade-slide-up-2">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <MusicNote size={18} />
                <Label color={T.gold}>Strategy Song</Label>
              </div>
              <blockquote style={{ fontFamily: T.serif, fontSize: "1.15rem", color: T.ink, margin: "0", lineHeight: 1.6, fontStyle: "italic" }}>
                "{result.song}"
              </blockquote>
              <p style={{ fontFamily: T.sans, fontSize: "0.8rem", color: T.inkLight, margin: "12px 0 0", fontWeight: 300 }}>
                Meow meow — sing this with your child in the moment. It works best when used consistently.
              </p>
            </div>

            <div style={{ padding: "28px 0", borderBottom: `1px solid ${T.rule}` }} className="fade-slide-up-3">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <BookIcon size={18} />
                <Label>Companion Book</Label>
              </div>
              {result.book ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <p style={{ fontFamily: T.sans, fontSize: "0.9rem", color: T.ink, margin: 0, fontWeight: 400 }}>{result.book.title}</p>
                  <a href={result.book.url} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: T.sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
                    color: T.slate, border: `1px solid ${T.slate}`, borderRadius: 4,
                    padding: "7px 16px", textDecoration: "none", whiteSpace: "nowrap", fontWeight: 500,
                  }}>View on Amazon →</a>
                </div>
              ) : (
                <p style={{ fontFamily: T.sans, fontSize: "0.88rem", color: T.inkLight, margin: 0, fontWeight: 300 }}>
                  No companion book for this episode. The broader Daniel Tiger series covers many of these themes.
                </p>
              )}
            </div>

            <div style={{ padding: "28px 0", borderBottom: `1px solid ${T.rule}` }} className="fade-slide-up-4">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Sparkle size={16} />
                <Label color={T.sage}>Yummy, Yummy, Yummy — A Parent Tip</Label>
              </div>
              <p style={{ fontFamily: T.sans, fontSize: "0.9rem", color: T.inkMid, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>
                {tip}
              </p>
            </div>

            <div style={{ padding: "28px 0" }} className="fade-slide-up-5">
              <Label>Rrroyally not quite right?</Label>
              <p style={{ fontFamily: T.sans, fontSize: "0.88rem", color: T.inkMid, margin: "0 0 16px", fontWeight: 300, lineHeight: 1.6 }}>
                Select the feeling you're navigating to browse more episodes:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: selectedFeeling ? 24 : 0 }}>
                {FEELINGS.map(f => (
                  <button key={f.id}
                    onClick={() => setSelectedFeeling(selectedFeeling === f.id ? null : f.id)}
                    style={{
                      fontFamily: T.sans, fontSize: "0.78rem", fontWeight: selectedFeeling === f.id ? 500 : 400,
                      color: selectedFeeling === f.id ? T.surface : T.inkMid,
                      background: selectedFeeling === f.id ? T.terracotta : "transparent",
                      border: `1px solid ${selectedFeeling === f.id ? T.terracotta : T.rule}`,
                      borderRadius: 4, padding: "6px 14px", cursor: "pointer", transition: "all 0.15s",
                    }}>
                    {f.label}
                  </button>
                ))}
              </div>

              {selectedFeeling && altEpisodes.length > 0 && (
                <div className="fade-in">
                  <div style={{ fontFamily: T.sans, fontSize: "0.72rem", color: T.inkLight, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                    More episodes — {FEELINGS.find(f => f.id === selectedFeeling)?.label}
                  </div>
                  {altEpisodes.map((ep, i) => (
                    <EpisodeMiniCard key={ep.episode} ep={ep} onClick={handlePickEpisode} animClass={`fade-slide-up-${Math.min(i+1,5)}`} />
                  ))}
                </div>
              )}
              {selectedFeeling && altEpisodes.length === 0 && (
                <p style={{ fontFamily: T.sans, fontSize: "0.85rem", color: T.inkLight, marginTop: 12 }} className="fade-in">
                  No additional episodes found for that feeling.
                </p>
              )}
            </div>

            <div style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 20, textAlign: "center" }}>
              <button onClick={goHome} style={{
                fontFamily: T.sans, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: T.terracotta, background: "none", border: `1px solid ${T.terracotta}`,
                borderRadius: 4, padding: "10px 24px", cursor: "pointer", fontWeight: 500,
              }}>← Start a new search</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

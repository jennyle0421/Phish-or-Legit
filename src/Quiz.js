import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Box,
  TextField,
  Stack,
  Modal,
} from "@mui/material";
import Confetti from "react-confetti";
import "./App.css";

const LeaderboardModal = ({ open, onClose, leaderboard }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 320, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">🏆 Leaderboard</Typography>
        <Button
          onClick={onClose}
          size="small"
          variant="text"
          sx={{ fontWeight: 'bold', textTransform: 'none', color: 'gray' }}
        >
          ✖ Close
        </Button>
      </Stack>
      {leaderboard.length > 0 ? (
        leaderboard.map((entry, index) => (
          <Typography key={index}>{index + 1}. {entry.name} - {entry.score}</Typography>
        ))
      ) : (
        <Typography>No scores yet!</Typography>
      )}
    </Box>
  </Modal>
);

const TIMER_DURATION = 12;
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [confetti, setConfetti] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showThreeSecondAlert, setShowThreeSecondAlert] = useState(false);
  const [showSevenSecondAlert, setShowSevenSecondAlert] = useState(false);
  const [showThemeHint, setShowThemeHint] = useState(false);

  useEffect(() => {
    if (gameStarted) startNewQuiz();
  }, [gameStarted]);

  useEffect(() => {
    let countdown;
    if (!showFeedback && timer > 0 && !quizCompleted) {
      if (timer === 7) {
        setShowSevenSecondAlert(true);
        setTimeout(() => setShowSevenSecondAlert(false), 1000);
      }
      if (timer === 3) {
        setShowThreeSecondAlert(true);
        setTimeout(() => setShowThreeSecondAlert(false), 1000);
      }
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && !showFeedback && !quizCompleted) {
      handleAnswerClick(-1);
    }
    return () => clearTimeout(countdown);
  }, [timer, showFeedback, quizCompleted]);  

  const startNewQuiz = () => {
    const questionCount = Math.floor(Math.random() * 6) + 10;
    const shuffled = shuffleArray(allQuestions).slice(0, questionCount);
    setQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setTimer(TIMER_DURATION);
    setQuizCompleted(false);
    setNameSubmitted(false);
  };

  const handleAnswerClick = (index) => {
    const currentQ = questions[currentQuestion];
    if (!currentQ) return; // 🔒 Prevents crash if no question is loaded
  
    setSelectedOption(index);
    setShowFeedback(true);
  
    if (index === currentQ.correctIndex) {
      setScore(score + 1);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
    }
  };
  

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setTimer(TIMER_DURATION);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleSubmitScore = () => {
    if (playerName.trim() !== "") {
      const newEntry = { name: playerName, score: score };
      const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 5);
      setLeaderboard(updatedLeaderboard);
      setNameSubmitted(true);
    }
  };

  if (!gameStarted) {
    return (
      <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "100px" }}>
        <Typography variant="h2" gutterBottom style={{ color: "#4caf50" }}>
          🧠 Welcome to Phish or Legit! 🎣
        </Typography>
        <Typography variant="h6" style={{ marginBottom: 40 }}>
          Learn to spot phishing attempts in a fun quiz format.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" size="large" onClick={() => setGameStarted(true)}>
            Start Quiz
          </Button>
          <Button variant="outlined" color="secondary" size="large" onClick={() => setShowLeaderboardModal(true)}>
            🏆 Leaderboard
          </Button>
        </Stack>
        <LeaderboardModal open={showLeaderboardModal} onClose={() => setShowLeaderboardModal(false)} leaderboard={leaderboard} />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "40px", background: theme === 'light' ? "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" : "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)", padding: 20, borderRadius: 10 }}>
      {confetti && <Confetti />}
      {showSevenSecondAlert && (
      <Box sx={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#ffeb3b',
        color: 'black',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        zIndex: 9999,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)'
      }}>
        ⚠️ 7 seconds left!
      </Box>
    )}
      {showThreeSecondAlert && (
      <Box sx={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        zIndex: 9999,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)'
      }}>
        ⏳ 3 seconds left!
      </Box>
    )}
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h2" gutterBottom style={{ color: theme === 'light' ? "#1976d2" : "#ffffff" }}>
          🎣 Phish or Legit? 🧠
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="text"
            onClick={() => setShowLeaderboardModal(true)}
            sx={{ fontSize: '.80rem', minWidth: 'auto', color: theme === 'light' ? '#000' : '#fff' }}
          >
            🏆 Leaderboard
          </Button>
          <Button
            variant="text"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            sx={{ fontSize: '.80rem', minWidth: 'auto', color: theme === 'light' ? '#000' : '#fff' }}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </Button>
        </Stack>
      </Stack>

      <LeaderboardModal open={showLeaderboardModal} onClose={() => setShowLeaderboardModal(false)} leaderboard={leaderboard} />

      {questions.length === 0 ? (
        <Typography variant="h6">Loading questions...</Typography>
      ) : quizCompleted ? (
        <>
          <Typography variant="h5" style={{ marginTop: 20 }}>
            🎉 Great job! You scored {score} out of {questions.length}!
          </Typography>

          {!nameSubmitted && (
            <>
              <TextField
                label="Enter your name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSubmitScore}>
                Submit Score
              </Button>
            </>
          )}

          <Stack justifyContent="center" style={{ marginTop: 30 }}>
            <Button variant="contained" color="secondary" onClick={startNewQuiz}>
              🔁 Play Again
            </Button>
          </Stack>

          <Card style={{ marginTop: 20 }}>
            <CardContent>
              <Typography variant="h6">🏆 Leaderboard</Typography>
              {leaderboard.map((entry, index) => (
                <Typography key={index}>{index + 1}. {entry.name} - {entry.score}</Typography>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(timer / TIMER_DURATION) * 100}
            style={{
              height: 10,
              marginBottom: 20,
              backgroundColor:
                timer <= 3
                  ? '#ffcccc' // red
                  : timer <= 7
                  ? '#fff59d' // yellow
                  : undefined
            }}            
          />
          <Card variant="outlined" style={{ padding: 20, marginBottom: 20, backgroundColor: '#fefefe' }}>
            <CardContent>
              <Typography variant="h5" style={{ marginBottom: 15 }}>
                {questions[currentQuestion].question}
              </Typography>
              <Box>
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    fullWidth
                    style={{
                      marginBottom: 10,
                      backgroundColor:
                        showFeedback && index === questions[currentQuestion].correctIndex
                          ? "#4caf50"
                          : showFeedback && index === selectedOption && index !== questions[currentQuestion].correctIndex
                          ? "#f44336"
                          : undefined
                    }}
                    onClick={() => handleAnswerClick(index)}
                    disabled={showFeedback}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
          {showFeedback && (
            <Card variant="outlined" style={{ backgroundColor: selectedOption === questions[currentQuestion].correctIndex ? "#d0f8ce" : selectedOption === -1 ? "#ffe0e0" : "#ffe082", padding: 20 }}>
              <CardContent>
                <Typography variant="h6">
                  {selectedOption === questions[currentQuestion].correctIndex
                    ? "✅ Correct!"
                    : selectedOption === -1
                    ? "⏰ Time's up!"
                    : "❌ Incorrect!"}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 10 }}>
                  {selectedOption >= 0
                    ? questions[currentQuestion].explanations[selectedOption]
                    : "You ran out of time!"}
                </Typography>
                <Button variant="contained" color="secondary" style={{ marginTop: 15 }} onClick={handleNextQuestion}>
                  Next Question
                </Button>
              </CardContent>
            </Card>
          )}
          <Typography variant="subtitle1" style={{ marginTop: 20 }}>
            Score: {score} / {questions.length}
          </Typography>
        </>
      )}
    </Container>
  );
};

const allQuestions = [
  {
    question: "You get an email from 'Amazon' asking to confirm your credit card info. What do you do?",
    options: [
      "Click the link and enter your info",
      "Ignore it and delete the email",
      "Reply to ask if it’s real",
      "Forward to your friends"
    ],
    correctIndex: 1,
    explanations: [
      "Never click suspicious links. This could lead to a phishing site.",
      "Correct! Ignoring and deleting suspicious emails keeps you safe.",
      "Phishers might reply to collect more data. Don’t engage.",
      "Forwarding spreads the risk to others."
    ]
  },
  {
    question: "You get a text saying 'You’ve won a free iPhone! Click here to claim it.' What should you do?",
    options: [
      "Click the link right away",
      "Tell your parents or teacher",
      "Reply to claim the prize",
      "Share it on social media"
    ],
    correctIndex: 1,
    explanations: [
      "Phishing links often steal your info. Don’t click.",
      "Correct! Tell an adult so they can help you handle it safely.",
      "Responding may confirm your number is active to scammers.",
      "Sharing scam links puts more people at risk."
    ]
  },
  {
    question: "A website asks for your school login to win Robux. What do you do?",
    options: [
      "Enter your school login info",
      "Tell your friend",
      "Ignore and close the site",
      "Screenshot and share it"
    ],
    correctIndex: 2,
    explanations: [
      "Never enter school credentials on unknown sites.",
      "Telling friends spreads potential harm.",
      "Correct! Ignoring and closing is the safest choice.",
      "Sharing screenshots spreads awareness but can also spread the scam."
    ]
  },
  {
    question: "An email says your package couldn’t be delivered. The link looks weird. What now?",
    options: [
      "Click the link and enter delivery info",
      "Forward to the post office",
      "Delete the email and don't click",
      "Reply with your address"
    ],
    correctIndex: 2,
    explanations: [
      "Phishing sites use fake delivery notices to trick people.",
      "Don't forward scams; it confuses real services.",
      "Correct! Deleting suspicious emails is safest.",
      "Never reply with personal info to unknown senders."
    ]
  },
  {
    question: "A pop-up says your computer is infected and to call a number. What do you do?",
    options: [
      "Call the number for help",
      "Tell an adult and close the pop-up",
      "Download the program it suggests",
      "Ignore and leave it open"
    ],
    correctIndex: 1,
    explanations: [
      "Fake support numbers often lead to scammers.",
      "Correct! A trusted adult can help keep you safe.",
      "Unknown programs may be viruses or malware.",
      "Leaving pop-ups can make things worse."
    ]
  },
  {
    question: "You get a message saying your Instagram will be deleted unless you log in now.",
    options: [
      "Click the link and log in",
      "Check Instagram's official website",
      "Panic and change your password",
      "Reply to ask if it's true"
    ],
    correctIndex: 1,
    explanations: [
      "Scammers create fake login pages to steal credentials.",
      "Correct! Always verify by going to the real site yourself.",
      "Panicking can lead to mistakes. Stay calm and verify first.",
      "Never reply to suspicious messages."
    ]
  },
  {
    question: "You find a USB stick outside school. What should you do?",
    options: [
      "Plug it into your computer",
      "Throw it away",
      "Give it to a teacher",
      "Take it home to check"
    ],
    correctIndex: 2,
    explanations: [
      "It could contain harmful software.",
      "You might destroy evidence or property.",
      "Correct! A teacher can turn it in safely.",
      "Never use unknown devices."
    ]
  },
  {
    question: "You see a post offering free game codes. It asks you to log in. What should you do?",
    options: [
      "Login to see if it’s real",
      "Report the post",
      "Share the post with friends",
      "Bookmark it for later"
    ],
    correctIndex: 1,
    explanations: [
      "Logging in may expose your account info.",
      "Correct! Reporting helps prevent harm to others.",
      "Sharing could lead others into the trap.",
      "Even saving scams can be dangerous."
    ]
  },
  {
    question: "You receive a 'support' email asking to reset your gaming account. What now?",
    options: [
      "Click the reset link",
      "Login directly through the game site",
      "Ignore it completely",
      "Reply and ask what’s going on"
    ],
    correctIndex: 1,
    explanations: [
      "Phishing links can mimic legit emails.",
      "Correct! Use trusted sites to check.",
      "Some real issues do need attention, but not through sketchy links.",
      "Replying may encourage scammers."
    ]
  },
  {
    question: "Your friend sends a weird link saying 'LOL you have to see this!' What do you do?",
    options: [
      "Click the link immediately",
      "Ask your friend if it’s real",
      "Forward it to others",
      "Report your friend"
    ],
    correctIndex: 1,
    explanations: [
      "You don’t know what’s behind that link.",
      "Correct! Ask to verify if they meant to send it.",
      "Spreading unknown links is risky.",
      "Start with asking first, don’t assume malice."
    ]
  },
  {
    question: "You get a pop-up saying 'Congratulations! You're the 1000th visitor!' What now?",
    options: [
      "Click and claim your prize",
      "Close the tab immediately",
      "Screenshot it and share",
      "Install the app it suggests"
    ],
    correctIndex: 1,
    explanations: [
      "Classic phishing trick. Don’t fall for it.",
      "Correct! Close pop-ups without clicking.",
      "Even sharing encourages curiosity.",
      "Installing unknown apps is dangerous."
    ]
  },
  {
    question: "Someone sends you a suspicious file on a game chat. What now?",
    options: [
      "Download and open it",
      "Report them to the platform",
      "Forward it to your friend",
      "Ignore it and move on"
    ],
    correctIndex: 1,
    explanations: [
      "Could contain malware or viruses.",
      "Correct! Reporting keeps the platform safe.",
      "Never forward files you don’t trust.",
      "Ignoring doesn’t stop the threat for others."
    ]
  },
  {
    question: "A link says you need to update your browser. It looks weird. What should you do?",
    options: [
      "Click and update",
      "Go to your browser’s official site",
      "Ignore it completely",
      "Ask your friend if they got it too"
    ],
    correctIndex: 1,
    explanations: [
      "Fake update sites may install malware.",
      "Correct! Always update through the official site.",
      "Some updates are important, so check safely.",
      "Friends may not know either. Trust official sources."
    ]
  },
  {
    question: "You’re told you need to log in to keep your school account. Link looks odd. What now?",
    options: [
      "Login immediately",
      "Tell your teacher",
      "Delete the email",
      "Send it to classmates to warn them"
    ],
    correctIndex: 1,
    explanations: [
      "Logging into fake portals is risky.",
      "Correct! Let a trusted adult help verify.",
      "Deleting helps, but teachers can take action.",
      "Spreading it may alarm others unnecessarily."
    ]
  },
  {
    question: "You’re watching a video and a download starts suddenly. What should you do?",
    options: [
      "Open the download to see what it is",
      "Scan it with antivirus",
      "Close the browser and delete the file",
      "Send it to your friend to check"
    ],
    correctIndex: 2,
    explanations: [
      "Opening unknown files is risky.",
      "Scanning is smart, but safest is deleting.",
      "Correct! Delete and move on safely.",
      "Your friend might also get infected."
    ]
  }
];
export default Quiz;


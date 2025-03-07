import React, { useState } from "react";
import { Button, Container, Typography, Card, CardContent } from "@mui/material";
import "./App.css";

const questions = [
  {
    question: "Which of these is a sign of a phishing email?",
    options: [
      "An email from your bank asking you to confirm your password via a link",
      "A message from your friend with a funny video",
      "An update from your favorite online store about a sale",
    ],
    correctIndex: 0,
    explanation: "Legitimate banks will never ask for your password via email.."
  },
  {
    question: "What should you do if you receive an email claiming you won a prize?",
    options: [
      "Click the link to claim it",
      "Ignore it and report it as spam",
      "Reply to the sender asking for more details",
    ],
    correctIndex: 1,
    explanation: "Unexpected prize emails are often scams. It's best to report and ignore them."
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerClick = (index) => {
    setSelectedOption(index);
    setShowFeedback(true);
    if (index === questions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Quiz completed! Your score: ${score}/${questions.length}`);
      setCurrentQuestion(0);
      setScore(0);
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Phish or Legit?
      </Typography>
      <Typography variant="h6" gutterBottom>
        Question {currentQuestion + 1} of {questions.length}
      </Typography>
      <Card variant="outlined" style={{ padding: "20px", marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h5">{questions[currentQuestion].question}</Typography>
        </CardContent>
      </Card>
      <div>
        {questions[currentQuestion].options.map((option, index) => (
          <Button
            key={index}
            variant="contained"
            color={
              showFeedback && index === questions[currentQuestion].correctIndex
                ? "success"
                : showFeedback && index === selectedOption
                ? "error"
                : "primary"
            }
            style={{ display: "block", width: "100%", marginBottom: "10px" }}
            onClick={() => handleAnswerClick(index)}
            disabled={showFeedback}
          >
            {option}
          </Button>
        ))}
      </div>
      {showFeedback && (
        <Card variant="outlined" style={{ padding: "20px", marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6">
              {selectedOption === questions[currentQuestion].correctIndex
                ? "Correct!"
                : "Incorrect!"}
            </Typography>
            <Typography variant="body1">{questions[currentQuestion].explanation}</Typography>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "10px" }}
              onClick={handleNextQuestion}
            >
              Next Question
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Quiz;
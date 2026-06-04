import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000";

export default function App() {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [view, setView] = useState("study"); // "study" or "manage"

  // Fetch all cards from backend
  useEffect(() => {
    fetch(`${API}/cards`)
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  // Add a new card
  const addCard = () => {
    if (!question || !answer) return alert("Fill in both fields!");
    fetch(`${API}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    })
      .then((res) => res.json())
      .then((newCard) => {
        setCards([...cards, newCard]);
        setQuestion("");
        setAnswer("");
      });
  };

  // Delete a card
  const deleteCard = (id) => {
    fetch(`${API}/cards/${id}`, { method: "DELETE" }).then(() => {
      const updated = cards.filter((c) => c.id !== id);
      setCards(updated);
      if (current >= updated.length) setCurrent(0);
    });
  };

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => setCurrent((prev) => (prev + 1) % cards.length), 150);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => setCurrent((prev) => (prev - 1 + cards.length) % cards.length), 150);
  };

  return (
    <div className="app">
      <h1>🃏 Flashcard App</h1>

      {/* Tab Navigation */}
      <div className="tabs">
        <button className={view === "study" ? "active" : ""} onClick={() => setView("study")}>
          Study
        </button>
        <button className={view === "manage" ? "active" : ""} onClick={() => setView("manage")}>
          Manage Cards
        </button>
      </div>

      {/* STUDY VIEW */}
      {view === "study" && (
        <div className="study-view">
          {cards.length === 0 ? (
            <p>No cards yet! Add some in "Manage Cards".</p>
          ) : (
            <>
              <p className="counter">{current + 1} / {cards.length}</p>
              <div className={`card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
                <div className="card-inner">
                  <div className="card-front">
                    <span>❓</span>
                    <p>{cards[current]?.question}</p>
                  </div>
                  <div className="card-back">
                    <span>✅</span>
                    <p>{cards[current]?.answer}</p>
                  </div>
                </div>
              </div>
              <p className="hint">Click card to flip</p>
              <div className="nav-buttons">
                <button onClick={prevCard}>← Prev</button>
                <button onClick={nextCard}>Next →</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* MANAGE VIEW */}
      {view === "manage" && (
        <div className="manage-view">
          <div className="add-form">
            <h2>Add New Card</h2>
            <input
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <input
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button onClick={addCard}>➕ Add Card</button>
          </div>

          <h2>All Cards ({cards.length})</h2>
          <ul className="card-list">
            {cards.map((card) => (
              <li key={card.id}>
                <div>
                  <strong>Q:</strong> {card.question} <br />
                  <strong>A:</strong> {card.answer}
                </div>
                <button className="delete-btn" onClick={() => deleteCard(card.id)}>🗑️</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // We'll add custom styles here

function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);
  
  // Initial board state
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: 'To Do',
      cards: [
        { id: 1, title: 'Learn React', description: 'Study React fundamentals' },
        { id: 2, title: 'Create Trello Clone', description: 'Build a simple Trello clone with dark UI' }
      ]
    },
    {
      id: 2,
      title: 'In Progress',
      cards: [
        { id: 3, title: 'Practice React Hooks', description: 'Master useState and useEffect' }
      ]
    },
    {
      id: 3,
      title: 'Done',
      cards: [
        { id: 4, title: 'Setup Development Environment', description: 'Install Node.js and create React app' }
      ]
    }
  ]);

  const [showNewCard, setShowNewCard] = useState({});
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [showNewBoard, setShowNewBoard] = useState(false);

  // Apply theme to document body
  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Add a new card to a board
  const addCard = (boardId) => {
    if (!newCardTitle.trim()) return;
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const newCard = {
          id: Date.now(),
          title: newCardTitle,
          description: newCardDescription
        };
        return {
          ...board,
          cards: [...board.cards, newCard]
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    setNewCardTitle('');
    setNewCardDescription('');
    setShowNewCard({});
  };

  // Add a new board
  const addBoard = () => {
    if (!newBoardTitle.trim()) return;
    
    const newBoard = {
      id: Date.now(),
      title: newBoardTitle,
      cards: []
    };
    
    setBoards([...boards, newBoard]);
    setNewBoardTitle('');
    setShowNewBoard(false);
  };

  // Delete a card
  const deleteCard = (boardId, cardId) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          cards: board.cards.filter(card => card.id !== cardId)
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
  };

  // Move a card to another board
  const moveCard = (fromBoardId, toBoardId, cardId) => {
    let cardToMove = null;
    let updatedBoards = boards.map(board => {
      if (board.id === fromBoardId) {
        cardToMove = board.cards.find(card => card.id === cardId);
        return {
          ...board,
          cards: board.cards.filter(card => card.id !== cardId)
        };
      }
      return board;
    });

    if (cardToMove) {
      updatedBoards = updatedBoards.map(board => {
        if (board.id === toBoardId) {
          return {
            ...board,
            cards: [...board.cards, cardToMove]
          };
        }
        return board;
      });
    }
    
    setBoards(updatedBoards);
  };

  // Theme-dependent classes
  const themeClasses = {
    appContainer: darkMode ? 'app-container dark-theme' : 'app-container light-theme',
    navbar: darkMode ? 'bg-dark' : 'bg-light',
    navbarVariant: darkMode ? 'dark' : 'light',
    boardBg: darkMode ? 'bg-dark-secondary' : 'bg-light-secondary',
    cardBg: darkMode ? 'bg-dark text-light' : 'bg-white text-dark',
    borderColor: darkMode ? 'border-secondary' : 'border-light-secondary',
    formBg: darkMode ? 'bg-dark text-light' : 'bg-white text-dark',
    badge: darkMode ? 'bg-dark-tertiary' : 'bg-light-tertiary text-dark',
    addButtonVariant: darkMode ? 'outline-light' : 'outline-dark',
    moveButtonVariant: darkMode ? 'outline-secondary' : 'outline-secondary',
    textColor: darkMode ? 'text-light' : 'text-dark',
    textSecondary: darkMode ? 'text-light-secondary' : 'text-secondary'
  };

  return (
    <div className={themeClasses.appContainer}>
      <Navbar bg={themeClasses.navbar.split('-')[1]} variant={themeClasses.navbarVariant} className="mb-4 shadow">
        <Container>
          <Navbar.Brand className="fw-bold">
            <i className="bi bi-kanban me-2"></i>
            {darkMode ? 'Dark' : 'Light'} Trello
          </Navbar.Brand>
          <Button 
            variant={darkMode ? "outline-light" : "outline-dark"}
            size="sm"
            onClick={toggleTheme}
            className="theme-toggle-btn"
          >
            {darkMode ? (
              <><i className="bi bi-sun me-1"></i> Light Mode</>
            ) : (
              <><i className="bi bi-moon me-1"></i> Dark Mode</>
            )}
          </Button>
        </Container>
      </Navbar>
      
      <Container fluid>
        <Row className="mb-4">
          <Col className="d-flex align-items-center">
            <h5 className={`mb-0 me-3 ${themeClasses.textColor}`}>My Boards</h5>
            {!showNewBoard ? (
              <Button 
                variant={themeClasses.addButtonVariant}
                size="sm"
                onClick={() => setShowNewBoard(true)}
                className="add-board-btn"
              >
                <i className="bi bi-plus"></i> Add Board
              </Button>
            ) : (
              <div className="d-flex">
                <Form.Control
                  size="sm"
                  placeholder="Board title"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className={`me-2 ${themeClasses.formBg}`}
                />
                <Button 
                  variant="success"
                  size="sm"
                  onClick={addBoard}
                  className="me-2"
                >
                  Add
                </Button>
                <Button 
                  variant={themeClasses.addButtonVariant}
                  size="sm"
                  onClick={() => setShowNewBoard(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Col>
        </Row>
        
        <Row className="board-container flex-nowrap overflow-auto pb-3">
          {boards.map(board => (
            <Col key={board.id} className="board-column" xs={12} md={4} lg={3}>
              <div className={`board ${themeClasses.boardBg} rounded shadow`}>
                <div className={`board-header p-3 border-bottom ${themeClasses.borderColor} d-flex justify-content-between align-items-center`}>
                  <h6 className={`mb-0 ${themeClasses.textColor}`}>{board.title}</h6>
                  <span className={`badge ${themeClasses.badge} rounded-pill`}>{board.cards.length}</span>
                </div>
                
                <div className="board-body p-2">
                  {board.cards.map(card => (
                    <Card key={card.id} className={`mb-2 ${themeClasses.cardBg} ${themeClasses.borderColor}`}>
                      <Card.Body className="py-2 px-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <Card.Title className="h6 mb-0">{card.title}</Card.Title>
                          <div className="card-actions">
                            <Button 
                              variant="link" 
                              className="p-0 text-danger"
                              onClick={() => deleteCard(board.id, card.id)}
                            >
                              <i className="bi bi-trash3"></i>
                            </Button>
                          </div>
                        </div>
                        <Card.Text className={`small ${themeClasses.textSecondary}`}>
                          {card.description}
                        </Card.Text>
                        <div className="mt-2">
                          {boards.filter(b => b.id !== board.id).map(targetBoard => (
                            <Button 
                              key={targetBoard.id}
                              variant={themeClasses.moveButtonVariant}
                              size="sm"
                              className="me-1 py-0 px-1 small"
                              onClick={() => moveCard(board.id, targetBoard.id, card.id)}
                            >
                              → {targetBoard.title}
                            </Button>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  
                  {showNewCard[board.id] ? (
                    <Card className={`mb-2 ${themeClasses.boardBg} ${themeClasses.textColor} ${themeClasses.borderColor}`}>
                      <Card.Body className="py-2 px-3">
                        <Form.Control
                          size="sm"
                          placeholder="Card title"
                          className={`mb-2 ${themeClasses.formBg}`}
                          value={newCardTitle}
                          onChange={(e) => setNewCardTitle(e.target.value)}
                        />
                        <Form.Control
                          as="textarea"
                          rows={2}
                          size="sm"
                          placeholder="Description"
                          className={`mb-2 ${themeClasses.formBg}`}
                          value={newCardDescription}
                          onChange={(e) => setNewCardDescription(e.target.value)}
                        />
                        <div className="d-flex justify-content-between">
                          <Button 
                            variant="success"
                            size="sm"
                            onClick={() => addCard(board.id)}
                          >
                            Add
                          </Button>
                          <Button 
                            variant={themeClasses.addButtonVariant}
                            size="sm"
                            onClick={() => setShowNewCard({})}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ) : (
                    <Button 
                      variant={themeClasses.moveButtonVariant}
                      className="w-100 my-2 add-card-btn"
                      onClick={() => setShowNewCard({...showNewCard, [board.id]: true})}
                    >
                      <i className="bi bi-plus"></i> Add Card
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;
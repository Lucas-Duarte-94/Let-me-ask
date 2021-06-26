// Importing Images.
import LogoImg from '../assets/images/logo.svg';
import DeleteImg from '../assets/images/delete.svg';
import check from '../assets/images/check.svg';
import answer from '../assets/images/answer.svg';

// Importing components.
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { database } from '../services/firebase';
import { UseRoom } from '../hooks/UseRoom';

// Importing libraries.
import { useHistory, useParams } from 'react-router-dom';


// Importing .scss files.
import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = UseRoom(roomId);

    function sendToHome() {
        history.push("/");
    }

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            closedAt: new Date()
        })

        history.push('/');
    }

    async function handleAnsweredQuestion(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    async function handleHighlightQuestion(questionId:string, highlighted: boolean) {
        if (highlighted) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted: false
            })
            return;
        }
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <button className="go-to-home" onClick={sendToHome}>
                        <img src={LogoImg} alt="Letmesask" />
                    </button>
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutLined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && 
                        <span>{questions.length} pergunta(s)</span>
                    }
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question 
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered = {question.isAnswered}
                                isHighlighted = {question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleAnsweredQuestion(question.id)}
                                        >
                                            <img src={check} alt="Marcar como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                        >
                                            <img src={answer} alt="Destacar a pergunta" />
                                        </button>

                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={DeleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
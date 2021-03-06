import illustration from '../assets/images/illustration.svg';
import letmeaskLogo from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';

import '../styles/auth.scss';
import { useAuth } from '../hooks/UseAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home() {
    const history = useHistory();
    const { user, SignInWithGoogle } = useAuth();
    const [ roomCode, setRoomCode ] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await SignInWithGoogle();
        }
        
        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if(roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()) {
            alert('Room does not exists!')
            return;
        }

        if (roomRef.val().closedAt) {
            alert('Room already closed!');
            return;
        }

        history.push(`rooms/${roomCode}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustration} alt="ilustração simbolizando pergunta e respostas" />
                <strong>Crie suas salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={letmeaskLogo} alt="letmesask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="imagem do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
import illustration from '../assets/images/illustration.svg';
import letmeaskLogo from '../assets/images/logo.svg';

import { Link, useHistory } from 'react-router-dom';
import { Button } from '../components/Button';

import '../styles/auth.scss';

import { useAuth } from '../hooks/UseAuth';
import { useState, FormEvent } from 'react';
import { database } from '../services/firebase';

export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();

    const [ newRoom, setNewRoom ] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        })

        history.push(`/rooms/${firebaseRoom.key}`)
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
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">Criar sala</Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    );
}
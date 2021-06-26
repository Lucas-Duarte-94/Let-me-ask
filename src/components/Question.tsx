import { ReactNode } from 'react';
import cx from 'classnames';

// Styles.
import '../styles/question.scss';

type QuestionType = {
    content: string;
    author: {
        name: string;
        avatar: string;
    },
    isAnswered: boolean;
    isHighlighted: boolean;
    children?: ReactNode;
}

export function Question({content, author, isAnswered = false, isHighlighted = false, children}: QuestionType) {
    return (
        <div className={cx('question', {answered : isAnswered}, {highlighted : isHighlighted && !isAnswered})}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name}/>
                    <span>{author.name}</span>
                </div>
                <div className="action-button">
                    {children}
                </div>
            </footer>
        </div>
    )
}
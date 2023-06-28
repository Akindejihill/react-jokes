import "./Joke.css";

export default function(props){

    const { id, vote, votes, text } = props;

    return (
        <div className="Joke">
          <div className="Joke-votearea">
            <button onClick={evt => vote(id, +1)}>
              <i className="fas fa-thumbs-up" />
            </button>
  
            <button onClick={evt => vote(id, -1)}>
              <i className="fas fa-thumbs-down" />
            </button>
  
            {votes}
          </div>
  
          <div className="Joke-text">{text}</div>
        </div>
      );

}
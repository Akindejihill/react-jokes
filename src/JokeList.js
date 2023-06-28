import { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

export default function JokeList(props) {
    const [jokes, setJokes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    //const [content, setContent] = useState([]);

    async function getJokes() {
        try {
            // load jokes one at a time, adding not-yet-seen jokes
            const jokesList = [];
            let seenJokes = new Set();

            while (jokesList.length < props.numJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" },
                });
                console.log(res.data.joke);
                let joke = res.data;

                if (!seenJokes.has(joke.id)) {
                    seenJokes.add(joke.id);
                    jokesList.push({ joke : joke, votes: 0 });
                } else {
                    console.log("duplicate found!");
                }
            }
            console.log("Jokes List: ", jokesList);
            return jokesList;
        } catch (err) {
            console.error(err);
        }
    }

    async function generateNewJokes() {
        setIsLoading(true);
        const jokesList = await getJokes();
        setIsLoading(false);
        
        const sortedJokes = jokesList.sort((a, b) => b.votes - a.votes);
        setJokes(sortedJokes); //this will not show and update untill component reload
        console.log("Sorted Jokes: ", sortedJokes);

        // const list = sortedJokes.map((j) =>
        //   <Joke
        //     text={j.joke.joke}
        //     key={j.joke.id}
        //     id={j.joke.id}
        //     votes={j.votes}
        //     vote={vote}
        //   />
        // );

        //setContent(list);
    }

    useEffect(() => {
      generateNewJokes()
    }, []);

    function vote(id, delta) {
        console.log("joke id delta: ", id, delta)
        console.log(
          jokes.map((joke) =>
            joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
          )
        );
        const list = jokes.map((joke) => {
          console.log("Joke id: ", joke.joke.id, id);
          if (joke.joke.id === id){
            console.log("test delta: ", joke.votes + delta)
            return {...joke, votes: joke.votes + delta}
          } else return joke
        });

        setJokes(list);
    }

    if (isLoading) {
      return (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )
    }
    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>
        {
          jokes.map((j) => (
            <Joke
              text={j.joke.joke}
              key={j.joke.id}
              id={j.joke.id}
              votes={j.votes}
              vote={vote}
            />
          ))
        }
      </div>
    );
}

JokeList.defaultProps = {
  numJokesToGet : 5
}
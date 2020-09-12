import React, { useState, useEffect } from "react";
import { dbService } from "firebaseConfig";

function Home({ userObj }) {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  console.log(userObj);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService
      .collection("tweets")
      .add({ text: tweet, createdAt: Date.now(), creatorId: userObj.uid });
    setTweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  useEffect(() => {
    dbService.collection("nweets").onSnapshot((snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="what's on your mind?"
          maxLength={120}
          value={tweet}
        />
        <input type="submit" value="Tweet" />
      </form>

      <div>
        {tweets.map((tweet) => (
          <div key={tweet.id}>
            <h4>{tweet.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;
